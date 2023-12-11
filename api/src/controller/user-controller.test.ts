import { Api } from '../server';
import request from 'supertest';
import { instance, mock, reset, when } from '@typestrong/ts-mockito';
import { UserController } from './user-controller';
import { type UserService } from '../service/user-service';
import { type User } from '../model/user';

describe('User controller', () => {
  const api = new Api();
  const mockedService: UserService = mock<UserService>();
  let sut: UserController;

  beforeAll(() => {
    sut = new UserController(instance(mockedService));
    api.addControllers(sut);
  });

  afterEach(() => {
    reset(mockedService);
  });

  it('should get all users', async () => {
    // Configurar el comportamiento del servicio mock
    const users: User[] = [
      { id: 1, name: 'User1' },
      { id: 2, name: 'User2' }
    ];
    when(mockedService.getAllUsers()).thenResolve(users);

    // Ejecutar el método del controlador que estás probando
    await request(api.app)
      .get('/user/')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(users);
      })
      .catch((err) => {
        throw new Error(err);
      });
  });
});
