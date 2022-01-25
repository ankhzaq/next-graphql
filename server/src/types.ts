import { Session } from 'express-session';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  redis: Redis,
  req: Request & { session: Session & { userId?: number } },
  res: Response,
}
