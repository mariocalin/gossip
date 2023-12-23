const axios = require('axios');
const { e2eConfiguration } = require('./configuration');
const { failTest } = require('./utils');

describe('Create a user', () => {
  it('POST /user/ should return status 201 created for a request to create a user with a name', async () => {
    const name = 'Create-user-test';
    try {
      const response = await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
        name
      });

      expect(response.status).toBe(201);

      const userResponse = response.data;
      expect(userResponse.id).toBeDefined();
      expect(userResponse.name).toEqual(name);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /user/ should return status 201 created for a request to create a user with a name and a picture', async () => {
    const name = 'Create-user-test-with-image';
    const picture = 'https://picsum.photos/200';

    try {
      const response = await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
        name,
        picture
      });

      expect(response.status).toBe(201);

      const userResponse = response.data;
      expect(userResponse.id).toBeDefined();
      expect(userResponse.name).toEqual(name);
      expect(userResponse.picture).toEqual(picture);
    } catch (error) {
      failTest(error);
    }
  });

  it('POST /user/ should return status 201 created for a request to create a user with a name and a wrong url picture', async () => {
    try {
      const name = 'Create-user-test-with-image';
      const picture = 'wrong-url';

      await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
        name,
        picture
      });
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.status).toBe(400);
      expect(error.response.data.picture).toBeDefined();
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
