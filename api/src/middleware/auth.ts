import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { parseInt } from 'lodash';

export function requireAuthorizationHeader(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.header('Authorization');

  if (authorization === undefined) {
    res.status(StatusCodes.FORBIDDEN).send(new Error('User unauthorized'));
    return;
  }

  const userId: string = authorization.replace('Bearer ', '');

  try {
    parseInt(userId);
  } catch (err) {
    res.status(StatusCodes.FORBIDDEN).send(new Error('User unauthorized'));
    return;
  }

  next();
}
