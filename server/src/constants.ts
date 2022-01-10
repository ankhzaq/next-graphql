import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import session, { SessionOptions } from 'express-session';

export const __prod__ = process.env.NODE_ENV === 'production';


const RedisStore = connectRedis(session);

export const cookieOptions: SessionOptions = {
  name: 'qid',
  store: new RedisStore({
    client: new Redis("127.0.0.1:6379"),
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
