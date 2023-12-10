export interface UserId {
  id: number;
}

export interface User {
  id: UserId;
  name: string;
  picture?: string;
}

export interface UserRepository {
  find: (userId: UserId) => Promise<User | null>;
  findByName: (name: string) => Promise<User | null>;
  findAll: () => Promise<User[]>;
  save: (user: User) => Promise<void>;
}
