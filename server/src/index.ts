// import { Post } from './entities/Post';
import "reflect-metadata";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import session from 'express-session';
import { MikroORM } from '@mikro-orm/core';
import microConfig from "./mikro-orm.config";
import cors from 'cors';

import { __prod__, cookieOptions } from './constants';

const main = async () => {

  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();

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
    context: ({ req, res }) => ({ em: orm.em, req, res })
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
