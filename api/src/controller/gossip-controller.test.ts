import { GossipController } from './gossip-controller';
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
import { type GossipService } from '../service/gossip-service';
import { type Gossip } from '../model/gossip';
import { provideId } from '../model/id';
import { type AuthService } from '../service/auth-service';

describe('Gossip controller', () => {
  const api = new Api();
  const mockedService: GossipService = mock<GossipService>();
  const mockedAuthrService: AuthService = mock<AuthService>();

  let sut: GossipController;
  const mockedUserId = provideId();

  beforeAll(() => {
    sut = new GossipController(
      instance(mockedService),
      instance(mockedAuthrService)
    );

    api.addControllers(sut);
  });

  beforeEach(() => {
    // Set auth always
    when(mockedAuthrService.checkAuth(anything())).thenResolve(true);
  });

  afterEach(() => {
    reset(mockedService);
    reset(mockedAuthrService);
  });

  it('should call service and return all gossips in json', async () => {
    const gossips: Gossip[] = getGossips();
    when(mockedService.getAllGossips()).thenResolve(gossips);

    await request(api.app)
      .get('/gossip/')
      .set('Authorization', `Bearer ${mockedUserId}`)
      .expect(200)
      .then((response) => {
        const receivedGossips: Gossip[] = response.body;

        for (const gossip of receivedGossips) {
          const receivedCreationDate = new Date(gossip.creationDate);
          gossip.creationDate = new Date(receivedCreationDate.getTime());
        }

        expect(receivedGossips).toEqual(gossips);
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.getAllGossips()).once();
  });

  it('should get content from request parameters and call service to create a Gossip with current user session', async () => {
    const content = 'This is a super gossip';

    when(mockedService.createGossip(mockedUserId, content)).thenResolve({
      content,
      id: provideId(),
      creator: mockedUserId,
      creationDate: new Date(),
      trust: []
    });

    await request(api.app)
      .post('/gossip/')
      .set('Authorization', `Bearer ${mockedUserId}`)
      .send({
        content
      })
      .expect(201)
      .then((response) => {
        const receivedGossip: Gossip = response.body;
        expect(receivedGossip.content).toEqual(content);
        expect(receivedGossip.id).toBeDefined();
        expect(receivedGossip.creator).toEqual(mockedUserId);
        expect(receivedGossip.creationDate).toBeDefined();
        expect(receivedGossip.trust).toHaveLength(0);
      })
      .catch((err) => {
        throw new Error(err);
      });

    verify(mockedService.createGossip(mockedUserId, content)).once();
  });

  function getGossips(): Gossip[] {
    return [
      {
        id: provideId(),
        content: 'This is a gossip',
        creator: mockedUserId,
        creationDate: new Date(),
        trust: []
      },
      {
        id: provideId(),
        content: 'This is another gossip',
        creator: mockedUserId,
        creationDate: new Date(),
        trust: [
          {
            trust: 'positive',
            user: provideId()
          }
        ]
      },
      {
        id: provideId(),
        content: 'This is a super gossip',
        creator: mockedUserId,
        creationDate: new Date(),
        trust: [
          {
            trust: 'negative',
            user: provideId()
          },
          {
            trust: 'positive',
            user: provideId()
          }
        ]
      }
    ];
  }
});
