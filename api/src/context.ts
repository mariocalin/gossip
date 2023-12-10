import { type UserRepository } from './model/user';
import { SQLiteUserRepository } from './repository/user-repository';
import { UserService } from './service/user-service';

export interface AppContext {
  repository: {
    userRepository: UserRepository;
  };
  service: {
    userService: UserService;
  };
}

export async function provideContext(): Promise<AppContext> {
  const userRepository: UserRepository = new SQLiteUserRepository();
  const userService: UserService = new UserService(userRepository);

  const context: AppContext = {
    repository: {
      userRepository
    },
    service: {
      userService
    }
  };

  return context;
}
