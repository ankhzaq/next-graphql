import { MiddlewareFn } from 'type-graphql/dist/interfaces/Middleware';
import { MyContext } from '../types';

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!parseInt(process.env.HEROKU_FIX_USER || "") && !context.req.session.userId) throw  new Error('not authenticated')
  return next();
}
