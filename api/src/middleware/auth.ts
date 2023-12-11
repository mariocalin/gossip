import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';
import { parseInt } from 'lodash';

export function requireAuthorizationHeader(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.header('Authorization');
  Logger.info('Auth');
  Logger.info(userId);

  if (userId === undefined) {
    res.status(StatusCodes.FORBIDDEN).send(new Error('User unauthorized'));
    return;
  }

  try {
    parseInt(userId);
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).send(new Error('User unauthorized'));
    return;
  }

  next();
}
