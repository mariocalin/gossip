import { type NextFunction, type Request, type Response } from 'express';
import Logger from 'jet-logger';

function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const method = req.method;
  const url = req.originalUrl;

  Logger.info(`${method} ${url}`);

  next();
}

export default requestLogger;
