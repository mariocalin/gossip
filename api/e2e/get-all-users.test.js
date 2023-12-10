const axios = require('axios');
const { e2eConfiguration } = require('./configuration');
const { failTest } = require('./utils');
const _ = require('lodash');

describe('Create a user', () => {
  const names = ['get-all-users-1', 'get-all-users-2', 'get-all-users-3'];

  beforeEach(async () => {
    await Promise.all(
      names.map(async (name) => {
        await axios.post(`${e2eConfiguration.baseUrl}/user/`, { name });
      })
    );
  });

  it('GET /user/ should return status 200 with at least contain users with names', async () => {
    try {
      const response = await axios.get(`${e2eConfiguration.baseUrl}/user/`);
      expect(response.status).toBe(200);
      expect(_.isArray(response.data)).toBeTruthy();
      const responseNames = response.data.map((u) => u.name);
      names.forEach((name) => {
        expect(responseNames).toContain(name);
      });
    } catch (error) {
      failTest(error);
    }
  });
});
