const axios = require('axios');
const { e2eConfiguration } = require('./configuration');

describe('Authorized requests', () => {
  it('Should fail if user is not in authorization', async () => {
    try {
      await axios.post(`${e2eConfiguration.baseUrl}/gossip/`);
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(403);
    }
  });
});
