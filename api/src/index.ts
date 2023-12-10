import { provideContext } from './context';
import { Api } from './server';
import Logger from 'jet-logger';

// Create an application instance
const application = new Api();

// Loading context
Logger.info('Providing context');
void provideContext()
  .then((context) => {
    Logger.info('Context provided');
    // Run the application
    Logger.info('Loading context');

    void application
      .loadContext(context)
      .then(() => {
        Logger.info('Context loaded');
        Logger.info('Application starting');
        application.start(() => {
          Logger.info('Application started');
        });
      })
      .catch((err) => {
        Logger.err('Error loading context');
        Logger.err(err);
      });
  })
  .catch((err) => {
    Logger.err('Error providing context');
    Logger.err(err);
  });
