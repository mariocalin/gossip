import { Api } from '../server';
import request from 'supertest';
import { anything, instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
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

  it('GET /user/ should return 200 OK with all users in json', async () => {
    // Given a set of users
    const users: User[] = [
      { id: 1, name: 'User1', picture: 'https://example.org/picture.jpg' },
      { id: 2, name: 'User2', picture: 'https://example.org/picture.jpg' }
    ];

    when(mockedService.getAllUsers()).thenResolve(users);

    // When request is sent
    await request(api.app)
      .get('/user/')
      .expect(200)
      .then((response) => {
        // Expect response to have users
        expect(response.body).toEqual(users);
      })
      .catch((err) => {
        throw new Error(err);
      });

    // Verify
    verify(mockedService.getAllUsers()).once();
  });

  it('POST /user with name should return 201 CREATED and create user', async () => {
    const name = 'My name';

    const mockUser: User = {
      id: provideId(),
      name
    };

    when(mockedService.createUser(name, anything())).thenResolve(mockUser);

    await request(api.app)
      .post('/user/')
      .send({
        name
      })
      .expect(201)
      .then((response) => {
        expect(response.body.id).toEqual(mockUser.id);
        expect(response.body.name).toEqual(name);
        expect(response.body.creationDate).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(name, anything())).once();
  });

  it('POST /user with name and picture should return 201 CREATED and create user', async () => {
    const name = 'My name';
    const picture = 'https://example.org/picture.jpg';

    const mockUser: User = {
      id: provideId(),
      name,
      picture
    };

    when(mockedService.createUser(name, picture)).thenResolve(mockUser);

    await request(api.app)
      .post('/user/')
      .send({
        name,
        picture
      })
      .expect(201)
      .then((response) => {
        expect(response.body.id).toEqual(mockUser.id);
        expect(response.body.name).toEqual(name);
        expect(response.body.picture).toEqual(picture);
        expect(response.body.creationDate).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(name, picture)).once();
  });

  it('POST /user should return 400 BAD_REQUEST when parameters have no name', async () => {
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

  it('POST /user should return 400 BAD_REQUEST when parameters have name but not a valid picture', async () => {
    await request(api.app)
      .post('/user/')
      .send({
        name: 'My name',
        picture: 'Wrong picture'
      })
      .expect(400)
      .then((response) => {
        expect(response.body.picture).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(anything())).never();
  });

  it('POST /user should return 400 BAD_REQUEST when parameters have name not in string', async () => {
    await request(api.app)
      .post('/user/')
      .send({
        name: 25
      })
      .expect(400)
      .then((response) => {
        expect(response.body.name).toBeDefined();
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createUser(anything())).never();
  });

  it('POST /user should return 500 INTERNAL_SERVER_ERROR when services produces error', async () => {
    when(mockedService.createUser(anything(), anything())).thenReject(new Error('Error'));

    await request(api.app)
      .post('/user/')
      .send({
        name: 'My name'
      })
      .expect(500)
      .catch((err) => {
        throw new Error(err);
      });
  });
});
