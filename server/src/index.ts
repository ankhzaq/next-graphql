// import { Post } from './entities/Post';
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session, { SessionOptions } from 'express-session';
import cors from 'cors';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { createConnection } from 'typeorm';
import path from 'path';

import { __prod__, COOKIE_NAME } from './constants';
import { User } from './entities/User';
import { Post } from './entities/Post';
import { Updoot } from './entities/Updoot';


const main = async () => {
  const conn = await createConnection({
    type: 'postgres',
    database: 'postgres',
    username: 'postgres',
    password: 'postgres',
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot]
  });

  // await Post.delete({});
  await conn.runMigrations();

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
    context: ({ req, res }) => ({ req, res, redis })
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
