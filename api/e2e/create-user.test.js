const request = require('supertest');
const { e2eConfiguration } = require('./configuration');
const { failTest } = require('./utils');

describe('Create a user', () => {
  it('should return status 202 created for a POST request to create a user with a name', async () => {
    const name = 'Super name';
    await request(e2eConfiguration.baseUrl)
      .post('/user/')
      .send({
        name
      })
      .expect(201)
      .then((response) => {
        const userResponse = response.body;
        expect(userResponse.id).toBeDefined();
        expect(userResponse.name).toEqual(name);
      })
      .catch((err) => {
        failTest(err);
      });
  });

  it('should return status 400 bad request for a POST request ', async () => {
    await request(e2eConfiguration.baseUrl)
      .post('/user/')
      .send()
      .expect(400)
      .then((response) => {
        expect(response.body.name).toBeDefined();
      })
      .catch((err) => {
        failTest(err);
      });
  });
});
