import { anything, instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
import { type Id, provideId } from '../model/id';
import { type User, type UserRepository } from '../model/user';
import { type Trust, type Gossip, type GossipRepository, type GossipTrust } from '../model/gossip';
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
      const gossip = getGossip();

      when(mockedUserRepository.find(nonExistingUserId)).thenResolve(null);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, nonExistingUserId, gossip.id);

      // Assert
      result.ifLeft((error) => {
        expect(error).toEqual('USER DOES NOT EXISTS');
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.update(anything())).never();
    });

    test('Should not add trust with a non existing gossip', async () => {
      // Arrange
      const existingUser = someUser();
      const trust: Trust = 'positive';
      const gossipId = provideId();

      when(mockedUserRepository.find(existingUser.id)).thenResolve(existingUser);
      when(mockedGossipRepository.find(gossipId)).thenResolve(null);

      // Act
      const result = await sut.trustGossip(trust, existingUser.id, gossipId);

      // Assert
      result.ifLeft((error) => {
        expect(error).toEqual('GOSSIP DOES NOT EXISTS');
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.update(anything())).never();
    });

    test('Should not add trust to an existing gossip with the same user that created the gossip', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'positive';
      const gossip = getGossip(provideId(), user.id);

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifLeft((error) => {
        expect(error).toEqual('GOSSIP BELONGS TO USER');
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.update(anything())).never();
    });

    test('Should add positive trust to an existing gossip in which the user has not voted yet', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'positive';
      const gossip = getGossipWithTrust();

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifRight((trusts) => {
        const expectedTrust: GossipTrust = {
          trust: 'positive',
          user: user.id
        };

        expect(trusts.filter((t) => t.trust === expectedTrust.trust && t.user === user.id)).toHaveLength(1);
        gossip.trust = trusts;
        verify(mockedGossipRepository.update(gossip)).once();
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
    });

    test('Should add negative trust to an existing gossip in which the user has not voted yet', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'negative';
      const gossip = getGossipWithTrust();

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifRight((trusts) => {
        const expectedTrust: GossipTrust = {
          trust: 'negative',
          user: user.id
        };

        expect(trusts.filter((t) => t.trust === expectedTrust.trust && t.user === user.id)).toHaveLength(1);

        gossip.trust = trusts;
        verify(mockedGossipRepository.update(gossip)).once();
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
    });

    test('Should not add positive trust to an existing gossip in which the user already voted positive', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'positive';
      const gossip = getGossipWithTrust();
      gossip.trust.push({
        trust: 'positive',
        user: user.id
      });

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifLeft((error) => {
        expect(error).toBe('USER ALREADY VOTED');
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.update(anything())).never();
    });

    test('Should not add negative trust to an existing gossip in which the user voted negative', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'negative';
      const gossip = getGossipWithTrust();
      gossip.trust.push({
        trust: 'negative',
        user: user.id
      });

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifLeft((error) => {
        expect(error).toBe('USER ALREADY VOTED');
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.update(anything())).never();
    });

    test('Should change trust from negative to possitive if the user already voted', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'positive';
      const gossip = getGossipWithTrust();
      gossip.trust.push({
        trust: 'negative',
        user: user.id
      });

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifRight((trusts) => {
        const expectedTrust: GossipTrust = {
          trust: 'positive',
          user: user.id
        };

        expect(trusts.filter((t) => t.trust === expectedTrust.trust && t.user === user.id)).toHaveLength(1);
        expect(trusts.filter((t) => t.user === user.id)).toHaveLength(1);

        gossip.trust = trusts;
        verify(mockedGossipRepository.update(gossip)).once();
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
    });

    test('Should change trust from positive to negative if the user already voted', async () => {
      // Arrange
      const user = someUser();
      const trust: Trust = 'negative';
      const gossip = getGossipWithTrust();
      gossip.trust.push({
        trust: 'positive',
        user: user.id
      });

      when(mockedUserRepository.find(user.id)).thenResolve(user);
      when(mockedGossipRepository.find(gossip.id)).thenResolve(gossip);

      // Act
      const result = await sut.trustGossip(trust, user.id, gossip.id);

      // Assert
      result.ifRight((trusts) => {
        const expectedTrust: GossipTrust = {
          trust: 'negative',
          user: user.id
        };

        expect(trusts.filter((t) => t.trust === expectedTrust.trust && t.user === user.id)).toHaveLength(1);
        expect(trusts.filter((t) => t.user === user.id)).toHaveLength(1);

        gossip.trust = trusts;
        verify(mockedGossipRepository.update(gossip)).once();
      });

      verify(mockedUserRepository.find(anything())).atMost(1);
      verify(mockedGossipRepository.find(anything())).atMost(1);
    });
  });

  function getGossip(id: Id = provideId(), creator: Id = provideId()): Gossip {
    return {
      id,
      content: 'Some content',
      creationDate: new Date(),
      creator,
      trust: []
    };
  }

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

  function getGossipWithTrust(): Gossip {
    const gossip: Gossip = {
      id: provideId(),
      content: 'Some content',
      creationDate: new Date(),
      creator: provideId(),
      trust: []
    };

    gossip.trust.push({ trust: 'negative', user: provideId() });
    gossip.trust.push({ trust: 'positive', user: provideId() });
    gossip.trust.push({ trust: 'negative', user: provideId() });
    gossip.trust.push({ trust: 'positive', user: provideId() });

    return gossip;
  }

  function someUser(id: Id = provideId()): User {
    return {
      id,
      name: 'Some user'
    };
  }
});
