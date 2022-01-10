import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Session } from 'express-session';
import { Request, Response } from 'express';

export type MyContext = {
  em: EntityManager<IDatabaseDriver<Connection>>
  req: Request & { session: Session & { userId?: number } },
  res: Response,
}
