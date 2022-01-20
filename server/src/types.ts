import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Session } from 'express-session';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>,
  redis: Redis,
  req: Request & { session: Session & { userId?: number } },
  res: Response,
}
