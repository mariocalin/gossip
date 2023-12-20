import { provideSQLite3Context } from '../db/dbcontext';
import { SQLiteContext } from '../db/sqlite-context';
import { provideId } from '../model/id';
import { type GossipTrust, type Gossip } from '../model/gossip';
import { SQLiteGossipRepository } from './sqlite-gossip-repository';
import { SQLiteUserRepository } from './sqlite-user-repository';
import { type User, type UserRepository } from '../model/user';

describe('SQLiteGossipRepository', () => {
  const samplePicture =
    'https://fastly.picsum.photos/id/840/200/300.jpg?hmac=Z8Mc1xk7GaQHQ1hkPTK4cY0dYIxDKGBCHrgyaDqE0u0';

  let sut: SQLiteGossipRepository;
  let testDb: SQLiteContext;
  let existingGossips: Gossip[];

  const existingUser: User = {
    id: provideId(),
    name: 'existing-test-user-sqlitegossip',
    picture: samplePicture
  };

  const voterUser: User = {
    id: provideId(),
    name: 'voter-test-user-sqlitegossip',
    picture: samplePicture
  };

  const voterUser2: User = {
    id: provideId(),
    name: 'voter-2-test-user-sqlitegossip',
    picture: samplePicture
  };

  const voterUser3: User = {
    id: provideId(),
    name: 'voter-3-test-user-sqlitegossip',
    picture: samplePicture
  };

  beforeAll(async () => {
    testDb = new SQLiteContext(await provideSQLite3Context());
    const userRepo: UserRepository = new SQLiteUserRepository(testDb);

    await userRepo.create(existingUser);
    await userRepo.create(voterUser);
    await userRepo.create(voterUser2);
    await userRepo.create(voterUser3);

    sut = new SQLiteGossipRepository(testDb);

    // Given a set of gossips
    const testGossip1: Gossip = {
      id: provideId(),
      content: 'Test Gossip 1',
      creator: existingUser.id,
      creationDate: new Date(),
      trust: []
    };

    const testGossip2: Gossip = {
      id: provideId(),
      content: 'Test Gossip 2',
      creator: existingUser.id,
      creationDate: new Date(),
      trust: []
    };

    await sut.create(testGossip1);
    await sut.create(testGossip2);

    existingGossips = [testGossip1, testGossip2];
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  it('findAll', async () => {
    // When find all
    const storedGossips = await sut.findAll();

    // Expect each test gossip to be stored
    existingGossips.forEach((gossip) => {
      expect(storedGossips).toContainEqual(gossip);
    });
  });

  it('find', async () => {
    const gossip = await sut.find(existingGossips[0].id);
    expect(gossip).toEqual(existingGossips[0]);
  });

  it('create', async () => {
    // Given a valid gossip
    const testGossip: Gossip = {
      id: provideId(),
      content: 'Should create gossip test',
      creator: existingUser.id,
      creationDate: new Date(),
      trust: [
        { user: voterUser.id, trust: 'positive' },
        { user: voterUser2.id, trust: 'negative' }
      ]
    };

    // When save gossip
    await sut.create(testGossip);

    // Expect to be stored
    const storedGossip = await sut.find(testGossip.id);
    expect(storedGossip?.content).toEqual(testGossip.content);
    expect(storedGossip?.creator).toEqual(testGossip.creator);
    expect(storedGossip?.creationDate).toEqual(testGossip.creationDate);

    // Assert the trust entries
    expect(sortTrustEntries(storedGossip?.trust)).toEqual(sortTrustEntries(testGossip.trust));
  });

  it('update', async () => {
    // Given a gossip with trust votes
    const testGossip: Gossip = {
      id: provideId(),
      content: 'Should update gossip test',
      creator: existingUser.id,
      creationDate: new Date(),
      trust: [
        { user: voterUser.id, trust: 'positive' },
        { user: voterUser2.id, trust: 'negative' }
      ]
    };

    await sut.create(testGossip);

    // When the trust votes are updated
    const updatedGossip: Gossip = {
      id: testGossip.id,
      content: testGossip.content,
      creator: existingUser.id,
      creationDate: testGossip.creationDate,
      trust: [
        { user: voterUser.id, trust: 'negative' },
        { user: voterUser3.id, trust: 'negative' }
      ]
    };

    await sut.update(updatedGossip);

    // Expect to be stored
    const storedGossip = await sut.find(updatedGossip.id);
    expect(storedGossip?.content).toEqual(updatedGossip.content);
    expect(storedGossip?.creator).toEqual(updatedGossip.creator);
    expect(storedGossip?.creationDate).toEqual(updatedGossip.creationDate);

    // Assert the updated trust entries
    const sortedStoredTrust = sortTrustEntries(storedGossip?.trust);
    const sortedUpdatedTrust = sortTrustEntries(updatedGossip.trust);

    // Verify specific trust entries
    expect(sortedStoredTrust?.length).toEqual(sortedUpdatedTrust?.length);
    sortedUpdatedTrust?.forEach((updatedTrust, index) => {
      expect(sortedStoredTrust?.[index]).toEqual(updatedTrust);
    });
  });

  function sortTrustEntries(trustEntries: GossipTrust[] | undefined): GossipTrust[] | undefined {
    return trustEntries?.sort(compareTrustEntries);
  }

  function compareTrustEntries(a: GossipTrust, b: GossipTrust): number {
    return a.user - b.user;
  }
});
