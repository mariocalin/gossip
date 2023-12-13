import { provideSQLite3Context } from '../db/dbcontext';
import { SQLiteContext } from '../db/sqlite-context';
import { provideId } from '../model/id';
import { type User } from '../model/user';
import { SQLiteUserRepository } from './sqlite-user-repository';

describe('SQLiteUserRepository', () => {
  let sut: SQLiteUserRepository;
  let testDb: SQLiteContext;

  beforeAll(async () => {
    testDb = new SQLiteContext(await provideSQLite3Context());
    sut = new SQLiteUserRepository(testDb);
  });

  afterAll(async () => {
    await testDb.destroy();
  });

  it('Should get all users', async () => {
    // Given a set of users
    const testUser1: User = {
      id: provideId(),
      name: 'get-test-user-1'
    };

    const testUser2: User = {
      id: provideId(),
      name: 'get-test-user-2'
    };

    await sut.create(testUser1);
    await sut.create(testUser2);

    const testUsers = [testUser1, testUser2];

    // When find all
    const storedUsers = await sut.findAll();

    // Expect each test user to be stored
    testUsers.forEach((u) => {
      expect(storedUsers).toContainEqual(u);
    });
  });

  it('Should create user', async () => {
    // Given a valid user
    const userId = provideId();

    const testUser: User = {
      id: userId,
      name: 'should-create-user-test'
    };

    // When save user
    await sut.create(testUser);

    // Expect to be stored
    const storedUser = await sut.find(userId);
    expect(storedUser).toEqual(testUser);
  });
});
