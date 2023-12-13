import { provideSQLite3Context } from './db/dbcontext';
import { SQLiteContext } from './db/sqlite-context';
import { type GossipRepository } from './model/gossip';
import { type UserRepository } from './model/user';
import { SQLiteGossipRepository } from './repository/sqlite-gossip-repository';
import { SQLiteUserRepository } from './repository/sqlite-user-repository';
import { AuthService } from './service/auth-service';
import { GossipService } from './service/gossip-service';
import { UserService } from './service/user-service';
import * as path from 'path';

export interface AppContext {
  repository: {
    userRepository: UserRepository;
    gossipRepository: GossipRepository;
  };
  service: {
    userService: UserService;
    gossipService: GossipService;
    authService: AuthService;
  };
}

export async function provideContext(): Promise<AppContext> {
  const sqliteContext = new SQLiteContext(
    await provideSQLite3Context(path.join(__dirname, 'db/db-file.sqlite3'))
  );

  const userRepository: UserRepository = new SQLiteUserRepository(
    sqliteContext
  );
  const gossipRepository: GossipRepository = new SQLiteGossipRepository(
    sqliteContext
  );

  const userService: UserService = new UserService(userRepository);
  const authService: AuthService = new AuthService(userRepository);
  const gossipService: GossipService = new GossipService(
    gossipRepository,
    userRepository
  );

  const context: AppContext = {
    repository: {
      userRepository,
      gossipRepository
    },
    service: {
      userService,
      gossipService,
      authService
    }
  };

  return context;
}
