import { Api } from './server';
import Logger from 'jet-logger';

// Create an application instance
const application = new Api();

// Run the application
Logger.info('Application starting');

application.start(() => {
  Logger.info('Application started');
});
