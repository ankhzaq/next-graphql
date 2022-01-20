// import { Post } from './entities/Post';
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session, { SessionOptions } from 'express-session';
import { MikroORM } from '@mikro-orm/core';
import microConfig from "./mikro-orm.config";
import cors from 'cors';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';

import { __prod__, COOKIE_NAME } from './constants';
import { User } from './entities/User';


const main = async () => {

  const orm = await MikroORM.init(microConfig);
  // clean user table
  // await orm.em.nativeDelete(User, { })
  await orm.getMigrator().up();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  const cookieOptions: SessionOptions = {
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: 'lax', // csrf
      secure: __prod__ // cookie only works in https
    },
    saveUninitialized: false,
    secret: 'qweklnasduioqwecdsak12das',
    resave: false
  };

  const app = express();

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  )

  app.use(
    session(cookieOptions)
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis })
  });

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  })


  app.get('/', (_, res) => {
    res.send('hello');
  });

}
main().catch((err) => {
  console.log("err: ", err);
});
