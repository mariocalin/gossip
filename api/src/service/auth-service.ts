import { type Id } from '../model/id';
import { type UserRepository } from '../model/user';

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  public async checkAuth(userId: Id): Promise<boolean> {
    const result = await this.userRepository.find(userId);
    return result !== null;
  }
}
