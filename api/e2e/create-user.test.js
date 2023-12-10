const axios = require('axios');
const { e2eConfiguration } = require('./configuration');
const { failTest } = require('./utils');

describe('Create a user with', () => {
  it('POST /user/ should return status 201 created for a request to create a user with a name', async () => {
    const name = 'Create-user-test';
    try {
      const response = await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
        name
      });

      // Verifica el código de estado
      expect(response.status).toBe(201);

      // Verifica la estructura de la respuesta
      const userResponse = response.data;
      expect(userResponse.id).toBeDefined();
      expect(userResponse.name).toEqual(name);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /user/ should return status 400 bad request with an error message for a request without name', async () => {
    try {
      await axios.post(`${e2eConfiguration.baseUrl}/user/`, {});
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(400);
      expect(error.response.data.name).toBeDefined();
    }
  });
});
