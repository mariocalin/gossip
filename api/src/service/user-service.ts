import { provideId } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { isNullOrUndefined } from '../utils';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(name: string): Promise<User> {
    const user: User = {
      id: { id: provideId() },
      name
    };

    if (!isNullOrUndefined(await this.userRepository.findByName(name))) {
      throw new Error('User already exists');
    }

    await this.userRepository.save(user);

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
