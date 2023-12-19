const axios = require('axios');
const { e2eConfiguration } = require('./configuration');

module.exports = {
  createUser: async (name) => {
    const response = await axios.post(`${e2eConfiguration.baseUrl}/user/`, {
      name,
      picture: 'https://picsum.photos/200'
    });

    return response.data;
  },
  createGossip: async (creator, content) => {
    const response = await axios.post(
      `${e2eConfiguration.baseUrl}/gossip/`,
      {
        content
      },
      {
        headers: {
          Authorization: `Bearer ${creator}`
        }
      }
    );

    return response.data;
  },
  createTrust: async (userId, gossipId, trust) => {
    const response = await axios.post(
      `${e2eConfiguration.baseUrl}/gossip/${gossipId}/${trust}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userId}`
        }
      }
    );

    return response.data;
  }
};
