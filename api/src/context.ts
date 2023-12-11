import { provideSQLite3Context } from './db/sqlite-context';
import { type UserRepository } from './model/user';
import { SQLiteUserRepository } from './repository/sqlite-user-repository';
import { UserService } from './service/user-service';
import * as path from 'path';

export interface AppContext {
  repository: {
    userRepository: UserRepository;
  };
  service: {
    userService: UserService;
  };
}

export async function provideContext(): Promise<AppContext> {
  const sqliteContext = await provideSQLite3Context(
    path.join(__dirname, 'db/db-file.sqlite3')
  );
  const userRepository: UserRepository = new SQLiteUserRepository(
    sqliteContext
  );
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
