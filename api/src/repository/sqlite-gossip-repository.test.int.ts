import { provideSQLite3Context } from '../db/dbcontext';
import { SQLiteContext } from '../db/sqlite-context';
import { provideId } from '../model/id';
import { type Gossip } from '../model/gossip';
import { SQLiteGossipRepository } from './sqlite-gossip-repository';

describe('SQLiteGossipRepository', () => {
  let sut: SQLiteGossipRepository;
  let testDb: SQLiteContext;

  beforeAll(async () => {
    testDb = new SQLiteContext(await provideSQLite3Context());
    sut = new SQLiteGossipRepository(testDb);
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  it('Should get all gossips', async () => {
    // Given a set of gossips
    const testGossip1: Gossip = {
      id: provideId(),
      content: 'Test Gossip 1',
      creator: provideId(),
      creationDate: new Date(),
      trust: []
    };

    const testGossip2: Gossip = {
      id: provideId(),
      content: 'Test Gossip 2',
      creator: provideId(),
      creationDate: new Date(),
      trust: []
    };

    await sut.create(testGossip1);
    await sut.create(testGossip2);

    const testGossips = [testGossip1, testGossip2];

    // When find all
    const storedGossips = await sut.findAll();

    // Expect each test gossip to be stored
    testGossips.forEach((gossip) => {
      expect(storedGossips).toContainEqual(gossip);
    });
  });

  it('Should create gossip', async () => {
    // Given a valid gossip
    const testGossip: Gossip = {
      id: provideId(),
      content: 'Should create gossip test',
      creator: provideId(),
      creationDate: new Date(),
      trust: [{ user: provideId(), trust: 'positive' }]
    };

    // When save gossip
    await sut.create(testGossip);

    // Expect to be stored
    const storedGossip = await sut.find(testGossip.id);
    expect(storedGossip).toEqual(testGossip);
  });
});
