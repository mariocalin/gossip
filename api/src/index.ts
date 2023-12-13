import { provideContext } from './context';
import { GossipController } from './controller/gossip-controller';
import { UserController } from './controller/user-controller';
import { Api } from './server';
import Logger from 'jet-logger';

async function startApplication(): Promise<void> {
  try {
    Logger.info('Providing context');
    const context = await provideContext();
    Logger.info('Context provided');

    // Create an application instance
    const application = new Api();

    // Run the application
    Logger.info('Loading context');

    const userController = new UserController(context.service.userService);

    const gossipController = new GossipController(
      context.service.gossipService,
      context.service.authService
    );

    await application.loadControllers([userController, gossipController]);
    Logger.info('Context loaded');

    Logger.info('Application starting');
    application.start(() => {
      Logger.info('Application started');
    });
  } catch (err) {
    Logger.err('Error during application startup');
    Logger.err(err);
  }
}

// Call the function to start the application
void startApplication();
