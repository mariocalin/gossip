import { Either } from '../arch/either';
import { type GossipRepository, type Gossip, type GossipTrust, type Trust } from '../model/gossip';
import { type Id, provideId } from '../model/id';
import { type User, type UserRepository } from '../model/user';

export type TrustGossipError = '';

export type CreateGossipError = 'USER DOES NOT EXISTS';

export class GossipService {
  constructor(
    private readonly gossipRepository: GossipRepository,
    private readonly userRepository: UserRepository
  ) {}

  public async getAllGossips(): Promise<Gossip[]> {
    return await this.gossipRepository.findAll();
  }

  async createGossip(userId: Id, content: string): Promise<Either<CreateGossipError, Gossip>> {
    const user = await this.ensureUserExists(userId);

    if (user === null) {
      return Either.left('USER DOES NOT EXISTS');
    }

    const gossip: Gossip = {
      id: provideId(),
      content,
      creationDate: new Date(),
      creator: userId,
      trust: []
    };

    await this.gossipRepository.create(gossip);

    return Either.right(gossip);
  }

  async trustGossip(trust: Trust, userId: Id, gossipId: Id): Promise<GossipTrust[] | TrustGossipError> {
    await this.ensureUserExists(userId);

    throw new Error('Method not implemented.');
  }

  private async ensureUserExists(userId: number): Promise<User | null> {
    return await this.userRepository.find(userId);
  }
}
