import { anything, instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
import { type Id, provideId } from '../model/id';
import { type User, type UserRepository } from '../model/user';
import { type Trust, type Gossip, type GossipRepository } from '../model/gossip';
import { GossipService } from './gossip-service';

describe('GossipService test', () => {
  const mockedUserRepository: UserRepository = mock<UserRepository>();
  const mockedGossipRepository: GossipRepository = mock<GossipRepository>();

  let sut: GossipService;

  beforeAll(() => {
    sut = new GossipService(instance(mockedGossipRepository), instance(mockedUserRepository));
  });

  afterEach(() => {
    reset(mockedUserRepository);
    reset(mockedGossipRepository);
  });

  describe('findAll', () => {
    test('Should get all gossips from repository', async () => {
      // Arrange
      const allGosips = getGossips();
      when(mockedGossipRepository.findAll()).thenResolve(allGosips);

      // Act
      const gossips = await sut.getAllGossips();

      // Assert
      allGosips.forEach((gossip) => {
        expect(gossips).toContain(gossip);
      });

      verify(mockedGossipRepository.findAll()).once();
    });
  });

  describe('createGossip', () => {
    test('Should create gossip with an existing user and content', async () => {
      // Arrange
      const existingUserId = provideId();
      const content = 'Some gossip';

      when(mockedUserRepository.find(existingUserId)).thenResolve(someUser(existingUserId));

      // Act
      const result = await sut.createGossip(existingUserId, content);

      // Assert
      expect(result.isRight()).toBeTruthy();
      result.ifRight((gossip) => {
        expect(gossip.content).toEqual(content);
        expect(gossip.creator).toEqual(existingUserId);

        verify(mockedGossipRepository.create(gossip)).once();
      });

      verify(mockedUserRepository.find(existingUserId)).once();
    });

    test('Should not create gossip with a non existing user', async () => {
      // Arrange
      const nonExistingUserId = provideId();
      const content = 'Some gossip';

      when(mockedUserRepository.find(nonExistingUserId)).thenResolve(null);

      // Act
      const result = await sut.createGossip(nonExistingUserId, content);
      expect(result.isLeft()).toBeTruthy();
      expect(result.getLeft()).toEqual('USER DOES NOT EXISTS');

      // Assert
      verify(mockedGossipRepository.create(anything())).never();
      verify(mockedUserRepository.find(nonExistingUserId)).once();
    });
  });

  describe('trustGossip', () => {
    test('Should not add trust with a non existing user', async () => {
      // Arrange
      const nonExistingUserId = provideId();
      const trust: Trust = 'positive';
      const gossipId = provideId();

      when(mockedUserRepository.find(nonExistingUserId)).thenResolve(null);

      // Act
      await sut.trustGossip(trust, nonExistingUserId, gossipId);

      // Assert

      expect(false).toBeTruthy();
    });
    test('Should not add trust with a non existing gossip', () => {
      expect(false).toBeTruthy();
    });
    test('Should not add trust to an existing gossip with the same user that created the gossip', () => {
      expect(false).toBeTruthy();
    });
    test('Should not add trust to an existing gossip with the same user that created the gossip', () => {
      expect(false).toBeTruthy();
    });
    test('Should add positive trust to an existing gossip in which the user has not voted yet', () => {
      expect(false).toBeTruthy();
    });
  });

  function getGossips(): Gossip[] {
    return [
      {
        id: provideId(),
        content: 'Some content',
        creationDate: new Date(),
        creator: provideId(),
        trust: []
      },
      {
        id: provideId(),
        content: 'Some content 2',
        creationDate: new Date(),
        creator: provideId(),
        trust: []
      },
      {
        id: provideId(),
        content: 'Some content 3',
        creationDate: new Date(),
        creator: provideId(),
        trust: []
      }
    ];
  }

  function someUser(id: Id): User {
    return {
      id,
      name: 'Some user'
    };
  }
});
