import {
  anything,
  instance,
  mock,
  reset,
  verify,
  when
} from '@typestrong/ts-mockito';
import { UserService } from './user-service';
import { provideId } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { uniqueId } from 'lodash';

describe('UserService test', () => {
  const mockedRepository: UserRepository = mock<UserRepository>();
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(instance(mockedRepository));
  });

  afterEach(() => {
    reset(mockedRepository);
  });

  it('Should create user with a name', async () => {
    // Given
    const name = 'John Doe';
    when(mockedRepository.findByName(name)).thenResolve(null);

    // When
    const user = await userService.createUser(name);

    // Then
    expect(user.name).toEqual(name);
    verify(mockedRepository.findByName(name)).once();
    verify(mockedRepository.save(user)).once();
  });

  it('Should nod create user if user with name already exists', async () => {
    // Given
    const name = 'John Doe';
    when(mockedRepository.findByName(name)).thenResolve(someUser(name));

    // When
    try {
      await userService.createUser(name);
    } catch (err) {
      expect(err).toBeDefined();
    }

    // Then
    verify(mockedRepository.findByName(name)).once();
    verify(mockedRepository.save(anything())).never();
  });

  it('Should get all users', async () => {
    // Given
    const existingUsers = someUsers();
    when(mockedRepository.findAll()).thenResolve(existingUsers);

    // When
    const users = await userService.getAllUsers();

    // Then
    expect(users).toEqual(existingUsers);
  });
});

function someUser(name: string): User {
  return {
    id: { id: provideId() },
    name
  };
}

function someUsers(): User[] {
  const users = [];

  users.push(someUser(`Some name ${uniqueId()}`));
  users.push(someUser(`Some name ${uniqueId()}`));
  users.push(someUser(`Some name ${uniqueId()}`));

  return users;
}
