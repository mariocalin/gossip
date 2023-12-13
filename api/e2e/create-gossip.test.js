const axios = require('axios');
const { e2eConfiguration } = require('./configuration');
const ld = require('lodash');
const { failTest } = require('./utils');

describe('Create gossip', () => {
  let user;

  beforeAll(async () => {
    const response = await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
      name: 'create-gossip-user'
    });

    user = response.data;
  });

  it('POST /gossip/ should return status 201 created for a request with an authenticated user and content', async () => {
    try {
      const response = await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/`,
        {
          content: 'Algo'
        },
        {
          headers: {
            Authorization: `Bearer ${user.id}`
          }
        }
      );

      expect(response.status).toBe(201);

      expect(response.data.id).toBeDefined();
      expect(response.data.content).toEqual('Algo');
      expect(response.data.creator).toEqual(user.id);
      expect(response.data.creationDate).toBeDefined();
      expect(ld.isArray(response.data.trust)).toBeTruthy();
    } catch (error) {
      failTest(error);
    }
  });
});
