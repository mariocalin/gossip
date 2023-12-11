import { Api } from '../server';
import request from 'supertest';
import {
  anything,
  instance,
  mock,
  reset,
  verify,
  when
} from '@typestrong/ts-mockito';
import { UserController } from './user-controller';
import { type UserService } from '../service/user-service';
import { type User } from '../model/user';
import { provideId } from '../model/id';

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

  it('should call service and return all users in json', async () => {
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

    verify(mockedService.getAllUsers()).once();
  });

  it('should call create user service with valid name', async () => {
    // Configurar el comportamiento del servicio mock
    const name = 'My name';

    const mockUser: User = {
      id: provideId(),
      name
    };

    when(mockedService.createUser(name)).thenResolve(mockUser);

    // Ejecutar el método del controlador que estás probando
    await request(api.app)
      .post('/user/')
      .send({
        name
      })
      .expect(201)
      .then((response) => {
        expect(response.body.id).toEqual(mockUser.id);
        expect(response.body.name).toEqual(mockUser.name);
        expect(response.body.creationDate).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(name)).once();
  });

  it('should return bad request when calling createUser with no name', async () => {
    // Ejecutar el método del controlador que estás probando
    await request(api.app)
      .post('/user/')
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body.name).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(anything())).never();
  });
});
