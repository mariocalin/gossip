import { GossipController } from './gossip-controller';
import { Api } from '../server';
import request from 'supertest';
import { anything, instance, mock, reset, verify, when } from '@typestrong/ts-mockito';
import { type GossipService } from '../service/gossip-service';
import { type Gossip, type GossipTrust } from '../model/gossip';
import { provideId } from '../model/id';
import { type AuthService } from '../service/auth-service';
import { ServiceError } from '../service/service-error';
import { Either } from '../common/either';

describe('Gossip controller', () => {
  const api = new Api();
  const mockedService: GossipService = mock<GossipService>();
  const mockedAuthrService: AuthService = mock<AuthService>();

  let sut: GossipController;
  const mockedUserId = provideId();

  beforeAll(() => {
    sut = new GossipController(instance(mockedService), instance(mockedAuthrService));

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

  describe('GET /gossip', () => {
    test('should return 200 OK with all gossips json', async () => {
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
  });

  describe('POST /gossip', () => {
    test('should create a Gossip and return 201 CREATED', async () => {
      const content = 'This is a super gossip';
      const gossip = {
        content,
        id: provideId(),
        creator: mockedUserId,
        creationDate: new Date(),
        trust: []
      };

      when(mockedService.createGossip(mockedUserId, content)).thenResolve(Either.right(gossip));

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

    test('should return 400 BAD_REQUEST when parameters are invalid', async () => {
      await request(api.app)
        .post('/gossip/')
        .set('Authorization', `Bearer ${mockedUserId}`)
        .send()
        .expect(400)
        .then((response) => {
          expect(response.body.content).toBeDefined();
        })
        .catch((err) => {
          throw new Error(err);
        });

      verify(mockedService.createGossip(anything(), anything())).never();
    });
  });

  describe('POST /gossip/:gossipId/:trust', () => {
    test('positive should return 200 OK', async () => {
      const gossipId = provideId();

      const trusts: GossipTrust[] = [
        {
          trust: 'positive',
          user: mockedUserId
        },
        {
          trust: 'positive',
          user: provideId()
        },
        {
          trust: 'positive',
          user: provideId()
        }
      ];

      when(mockedService.trustGossip('positive', mockedUserId, gossipId)).thenResolve(Either.right(trusts));

      // When
      await request(api.app)
        .post(`/gossip/${gossipId}/positive`)
        .set('Authorization', `Bearer ${mockedUserId}`)
        .expect(200)
        .then((response) => {
          const receivedTrusts = response.body as GossipTrust[];
          trusts.forEach((trust) => {
            expect(receivedTrusts).toContainEqual(trust);
          });
        })
        .catch((err) => {
          throw new Error(err);
        });

      verify(mockedService.trustGossip('positive', mockedUserId, gossipId)).once();
    });

    test('negative should return 200 OK', async () => {
      const gossipId = provideId();

      const trusts: GossipTrust[] = [
        {
          trust: 'negative',
          user: mockedUserId
        },
        {
          trust: 'positive',
          user: provideId()
        },
        {
          trust: 'negative',
          user: provideId()
        }
      ];

      when(mockedService.trustGossip('negative', mockedUserId, gossipId)).thenResolve(Either.right(trusts));

      // When
      await request(api.app)
        .post(`/gossip/${gossipId}/negative`)
        .set('Authorization', `Bearer ${mockedUserId}`)
        .expect(200)
        .then((response) => {
          const receivedTrusts = response.body as GossipTrust[];
          trusts.forEach((trust) => {
            expect(receivedTrusts).toContainEqual(trust);
          });
        })
        .catch((err) => {
          throw new Error(err);
        });

      verify(mockedService.trustGossip('negative', mockedUserId, gossipId)).once();
    });

    test('positive with a non number id should return 400 BAD_REQUEST', async () => {
      // Given a non number id
      const gossipId = 'abcde12345';

      // When
      await request(api.app)
        .post(`/gossip/${gossipId}/positive`)
        .set('Authorization', `Bearer ${mockedUserId}`)
        .expect(400)
        .then((response) => {
          expect(response.body.id).toBeDefined();
        })
        .catch((err) => {
          throw new Error(err);
        });

      verify(mockedService.trustGossip(anything(), anything(), anything())).never();
    });

    test('positive with service error should return 500 INTERNAL_SERVER_ERROR', async () => {
      const gossipId = provideId();
      when(mockedService.trustGossip('positive', mockedUserId, gossipId)).thenReject(new ServiceError('Service error'));

      // When
      await request(api.app)
        .post(`/gossip/${gossipId}/positive`)
        .set('Authorization', `Bearer ${mockedUserId}`)
        .expect(500)
        .catch((err) => {
          throw new Error(err);
        });
    });

    test('positive with internal error should return 500 INTERNAL_SERVER_ERROR', async () => {
      const gossipId = provideId();

      when(mockedService.trustGossip('positive', mockedUserId, gossipId)).thenReject(new Error('Unexpected error'));

      // When
      await request(api.app)
        .post(`/gossip/${gossipId}/positive`)
        .set('Authorization', `Bearer ${mockedUserId}`)
        .expect(500);
    });
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
