import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';

function errorHandler(err: Error, _: Request, res: Response, next: NextFunction): void {
  Logger.err(err);

  if (res.headersSent) {
    next(err);
    return;
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ errors: [{ message: 'Something went wrong' }] });
}

export default errorHandler;
