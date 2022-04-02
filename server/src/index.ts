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
import { createCreatorLoader } from './utils/CreatorLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';


const main = async () => {
  const conn = await createConnection({
    host: 'kandula.db.elephantsql.com',
    type: 'postgres',
    database: 'umwjsgut',
    username: 'umwjsgut',
    password: 'Sng9yOdKcdshNr_VYtKmE-7cQPl_xHhd',
    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot]
  });

  await conn.runMigrations();

  const RedisStore = connectRedis(session);

  const redis = new Redis(process.env.REDIS_URL || '');

  const cookieOptions: SessionOptions = {
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redis,
      disableTouch: true
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      path: "/",
      // httpOnly: true,
      // sameSite: 'lax', // csrf
      secure: true // cookie only works in https
    },
    saveUninitialized: true,
    secret: 'qweklnasduioqwecdsak12das',
    resave: false
  };

  const app = express();
  app.set("trust proxy", 1);
  app.use(cors({
    origin: 'https://reddit-next-app.herokuapp.com',
    credentials: true,
  }))

  app.use(
    session(cookieOptions)
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false
    }),
    context: ({ req, res }) => ({ req, res, redis, userLoader: createCreatorLoader(), updootLoader: createUpdootLoader() })
  });

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(process.env.PORT || 4000, () => {
    console.log('server started on localhost:4000');
  })


  app.get('/', (_, res) => {
    res.send('hello');
  });

}
main().catch((err) => {
  console.log("err: ", err);
});
