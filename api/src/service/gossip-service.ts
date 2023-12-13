import { type GossipRepository, type Gossip } from '../model/gossip';
import { provideId } from '../model/id';
import { type UserRepository } from '../model/user';

export class GossipService {
  constructor(
    private readonly gossipRepository: GossipRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async getAllGossips(): Promise<Gossip[]> {
    return await this.gossipRepository.findAll();
  }

  async createGossip(userId: number, content: string): Promise<Gossip> {
    await this.ensureUserExists(userId);

    const gossip: Gossip = {
      id: provideId(),
      content,
      creationDate: new Date(),
      creator: userId,
      trust: []
    };

    await this.gossipRepository.create(gossip);

    return gossip;
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const user = await this.userRepository.find(userId);

    if (user === null) {
      throw new Error('User does not exists');
    }
  }
}
