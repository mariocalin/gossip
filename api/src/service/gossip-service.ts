import { Either } from '../common/either';
import { type GossipRepository, type Gossip, type GossipTrust, type Trust } from '../model/gossip';
import { type Id, provideId } from '../model/id';
import { type User, type UserRepository } from '../model/user';

export type TrustGossipError =
  | 'USER DOES NOT EXISTS'
  | 'GOSSIP DOES NOT EXISTS'
  | 'GOSSIP BELONGS TO USER'
  | 'USER ALREADY VOTED';

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

  async trustGossip(trust: Trust, userId: Id, gossipId: Id): Promise<Either<TrustGossipError, GossipTrust[]>> {
    const user = await this.ensureUserExists(userId);
    if (user === null) {
      return Either.left('USER DOES NOT EXISTS');
    }

    const gossip = await this.gossipRepository.find(gossipId);
    if (gossip === null) {
      return Either.left('GOSSIP DOES NOT EXISTS');
    }

    if (gossip.creator === userId) {
      return Either.left('GOSSIP BELONGS TO USER');
    }

    const userTrust = gossip.trust.find((t) => t.user === userId);

    if (userTrust === undefined) {
      gossip.trust.push({
        trust,
        user: userId
      });
    } else {
      if (userTrust.trust === trust) {
        return Either.left('USER ALREADY VOTED');
      }

      userTrust.trust = trust;
    }

    await this.gossipRepository.update(gossip);

    return Either.right(gossip.trust);
  }

  private async ensureUserExists(userId: number): Promise<User | null> {
    return await this.userRepository.find(userId);
  }
}
