const axios = require('axios');
const { e2eConfiguration } = require('./configuration');
const ld = require('lodash');
const { failTest } = require('./utils');
const { createUser, createGossip, createTrust } = require('./wrapper');

describe('Trust gossip', () => {
  let currentUser;
  let gossipCreator;

  beforeAll(async () => {
    currentUser = await createUser('trust-gossip-user');
    gossipCreator = await createUser('creator-trust-gossip-user');
  });

  it('POST /gossip/:gossipId/positive should return status 200 OK', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');

    try {
      const response = await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/positive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );

      expect(response.status).toBe(200);

      const data = response.data;
      expect(ld.isArray(data)).toBeTruthy();
      expect(data.filter((t) => t.trust === 'positive' && t.user === currentUser.id)).toHaveLength(1);
      expect(data.filter((t) => t.trust === 'negative' && t.user === currentUser.id)).toHaveLength(0);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /gossip/:gossipId/negative should return status 200', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');

    try {
      const response = await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/negative`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );

      expect(response.status).toBe(200);

      const data = response.data;
      expect(ld.isArray(data)).toBeTruthy();
      expect(response.data.filter((t) => t.trust === 'positive' && t.user === currentUser.id)).toHaveLength(0);
      expect(response.data.filter((t) => t.trust === 'negative' && t.user === currentUser.id)).toHaveLength(1);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /gossip/:gossipId/positive should return status 400 in previously voted positive gossip', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');
    await createTrust(currentUser.id, gossip.id, 'positive');

    try {
      await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/positive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(400);
    }
  });

  it('POST /gossip/:gossipId/negative should return status 400 in previously voted negative gossip', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');
    await createTrust(currentUser.id, gossip.id, 'negative');

    try {
      await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/negative`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(400);
    }
  });

  it('POST /gossip/:gossipId/positive should return status 200 in previously voted negative gossip', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');
    await createTrust(currentUser.id, gossip.id, 'negative');

    try {
      const response = await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/positive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );

      expect(response.status).toBe(200);

      const data = response.data;
      expect(ld.isArray(data)).toBeTruthy();
      expect(data.filter((t) => t.trust === 'positive' && t.user === currentUser.id)).toHaveLength(1);
      expect(data.filter((t) => t.trust === 'negative' && t.user === currentUser.id)).toHaveLength(0);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /gossip/:gossipId/negative should return status 200 in previously voted positive gossip', async () => {
    const gossip = await createGossip(gossipCreator.id, 'This is quite a story');
    await createTrust(currentUser.id, gossip.id, 'positive');

    try {
      const response = await axios.post(
        `${e2eConfiguration.baseUrl}/gossip/${gossip.id}/negative`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser.id}`
          }
        }
      );

      expect(response.status).toBe(200);

      const data = response.data;
      expect(ld.isArray(data)).toBeTruthy();
      expect(response.data.filter((t) => t.trust === 'positive' && t.user === currentUser.id)).toHaveLength(0);
      expect(response.data.filter((t) => t.trust === 'negative' && t.user === currentUser.id)).toHaveLength(1);
    } catch (error) {
      failTest(error);
    }
  });
});
