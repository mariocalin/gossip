import { provideId } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { isNullOrUndefined } from '../common/utils';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(name: string, picture?: string): Promise<User> {
    const user: User = {
      id: provideId(),
      name,
      picture
    };

    if (!isNullOrUndefined(await this.userRepository.findByName(name))) {
      throw new Error('User already exists');
    }

    await this.userRepository.create(user);

    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
