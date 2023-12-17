import { instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
import { provideId } from '../model/id';
import { type UserRepository, type User } from '../model/user';
import { AuthService } from './auth-service';

describe('AuthService test', () => {
  const mockedRepository: UserRepository = mock<UserRepository>();
  let sut: AuthService;

  beforeAll(() => {
    sut = new AuthService(instance(mockedRepository));
  });

  afterEach(() => {
    reset(mockedRepository);
  });

  it('Should authorize user if found', async () => {
    // Given
    const someUser: User = {
      id: provideId(),
      name: 'Test User',
      picture: 'https://example.org/picture.jpg'
    };

    when(mockedRepository.find(someUser.id)).thenResolve(someUser);

    // When
    const authoirzed = await sut.checkAuth(someUser.id);

    // Then
    expect(authoirzed).toBeTruthy();
    verify(mockedRepository.find(someUser.id)).once();
  });

  it('Should not authorize user if not found', async () => {
    // Given
    const userId = provideId();

    when(mockedRepository.find(userId)).thenResolve(null);

    // When
    const authoirzed = await sut.checkAuth(userId);

    // Then
    expect(authoirzed).toBeFalsy();
    verify(mockedRepository.find(userId)).once();
  });
});
