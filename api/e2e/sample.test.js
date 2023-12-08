const request = require('supertest');
const { e2eConfiguration } = require('./configuration');
const { failTest } = require('./utils');

describe('API End-to-End Tests', () => {
  it('should return status 200 for a GET request', async () => {
    await request(e2eConfiguration.baseUrl)
      .get('/')
      .expect(200)
      .then((response) => {
        // Puedes realizar aserciones adicionales según sea necesario
        // Por ejemplo, puedes verificar el cuerpo de la respuesta
        expect(response.body).toEqual(/* tu valor esperado */);
      })
      .catch((err) => {
        failTest(err);
      });
  });
});
