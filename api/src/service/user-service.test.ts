import { anything, instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
import { UserService } from './user-service';
import { provideId } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { uniqueId } from 'lodash';

describe('UserService test', () => {
  const mockedRepository: UserRepository = mock<UserRepository>();
  let sut: UserService;

  beforeAll(() => {
    sut = new UserService(instance(mockedRepository));
  });

  afterEach(() => {
    reset(mockedRepository);
  });

  it('Should create user with a name', async () => {
    // Given
    const name = 'John Doe';
    when(mockedRepository.findByName(name)).thenResolve(null);

    // When
    const user = await sut.createUser(name);

    // Then
    expect(user.name).toEqual(name);
    verify(mockedRepository.findByName(name)).once();
    verify(mockedRepository.create(user)).once();
  });

  it('Should nod create user if user with name already exists', async () => {
    // Given
    const name = 'John Doe';
    when(mockedRepository.findByName(name)).thenResolve(someUser(name));

    // When
    try {
      await sut.createUser(name);
    } catch (err) {
      expect(err).toBeDefined();
    }

    // Then
    verify(mockedRepository.findByName(name)).once();
    verify(mockedRepository.create(anything())).never();
  });

  it('Should get all users', async () => {
    // Given
    const existingUsers = someUsers();
    when(mockedRepository.findAll()).thenResolve(existingUsers);

    // When
    const users = await sut.getAllUsers();

    // Then
    expect(users).toEqual(existingUsers);
  });
});

function someUser(name: string): User {
  return {
    id: provideId(),
    name,
    picture: 'https://example.org/picture.jpg'
  };
}

function someUsers(): User[] {
  const users = [];

  users.push(someUser(`Some name ${uniqueId()}`));
  users.push(someUser(`Some name ${uniqueId()}`));
  users.push(someUser(`Some name ${uniqueId()}`));

  return users;
}
