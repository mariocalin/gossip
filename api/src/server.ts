import { Server } from '@overnightjs/core';
import * as bodyParser from 'body-parser';
import Logger from 'jet-logger';
import errorHandler from './middleware/error-handler';
import 'express-async-errors';
import requestLogger from './middleware/request-logger';

export class Api extends Server {
  private readonly DEFAULT_PORT = 3000;

  constructor() {
    super(process.env.NODE_ENV === 'development');
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(errorHandler);
    this.app.use(requestLogger);
  }

  public async loadControllers(controllers: any[]): Promise<void> {
    this.addControllers(controllers);
  }

  public start(onStart: () => void): void {
    this.app.listen(this.DEFAULT_PORT, () => {
      Logger.info('Server listening on port: ' + this.DEFAULT_PORT);
      onStart();
    });
  }
}
