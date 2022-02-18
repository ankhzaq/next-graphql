import { Session } from 'express-session';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';
import { createCreatorLoader } from './utils/CreatorLoader';
import { createUpdootLoader } from './utils/createUpdootLoader';

export type MyContext = {
  redis: Redis,
  req: Request & { session: Session & { userId?: number } },
  res: Response,
  userLoader: ReturnType<typeof createCreatorLoader>,
  updootLoader: ReturnType<typeof createUpdootLoader>,
}
