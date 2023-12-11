import { type Id } from './id';

export interface User {
  id: Id;
  name: string;
  picture?: string;
}

export interface UserRepository {
  find: (userId: Id) => Promise<User | null>;
  findByName: (name: string) => Promise<User | null>;
  findAll: () => Promise<User[]>;
  save: (user: User) => Promise<void>;
}
