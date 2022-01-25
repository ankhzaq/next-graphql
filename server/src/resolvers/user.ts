import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import argon2 from 'argon2';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { validateRegister } from '../utils/validateRegister';
import { UsernamePasswordInput } from './UsernamePasswordInput';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { getConnection } from 'typeorm';

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (!newPassword || newPassword.length < 3) {
      return {
        errors: [{
          field: 'newPassword',
          message: 'length must be greater than three'
        }]
      }
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [{
          field: 'token',
          message: 'token expired'
        }]
      }
    }
    const userIdNum = parseInt(userId);
    const user =  await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [{
          field: 'token',
          message: 'user no longer exists'
        }]
      }
    }

    await User.update({ id: userIdNum}, { password:  await argon2.hash(newPassword) })

    await redis.del(key);

    // log in use after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis } : MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return false;
    }

    const token = v4(); // create unique tokensd
    await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); // token is valid for 3 days

    await sendEmail(
      email,
      `<a href='http://localhost:3000/change-password/${token}'>reset password</a>`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext){

    if (!req.session.userId) {
      return null;
    }

    return User.findOne(req.session.userId);
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const { username, email, password } = options;
    const errors = validateRegister(options);
    if (errors) return errors;
    const hashedPassword = await argon2.hash(password);
    let user;
    try {
      // User.create({}).save()
      const result = await getConnection().createQueryBuilder().insert().into(User).values({
        email,
        username,
        password: hashedPassword,
      }).returning("*").execute();
      // await em.persistAndFlush(user);
      user = result.raw[0];
    } catch(error) {
      // duplicate username error
      if (error.code === "23505") {
        return {
          errors: [{
            field: "username",
            message: 'username already taken'
          }]
        }
      }
      return {
        errors: [{
          field: "server",
          message: error
        }]
      }
    }
    // Store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };

  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('usernameOrEmail') usernameOrEmail: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {

    const user = await User.findOne(usernameOrEmail.includes('@') ? { where: { email: usernameOrEmail} } : { where: { username: usernameOrEmail } })
    if (!user) {
      return {
        errors: [{
          field: 'usernameOrEmail',
          message: "that username or email doesn't exist"
        }]
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [{
          field: 'password',
          message: "incorrect password"
        }]
      };
    }

    // Store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return {
      user
    };
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME);
      if (err) {
        console.log(err);
        resolve(false); return
      }
      resolve(true)
    }));
  }
}
