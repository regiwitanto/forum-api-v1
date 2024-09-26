/* istanbul ignore file */
const ServerInjectionFunctionHelper = {
  async injection(server, options) {
    return await server.inject(options);
  },

  addUserOption(payload) {
    return {
      method: 'POST',
      url: '/users',
      payload: payload,
    };
  },

  addAuthOption(payload) {
    return {
      method: 'POST',
      url: '/authentications',
      payload: payload,
    };
  },

  addThreadOption(payload, auth) {
    return {
      method: 'POST',
      url: '/threads',
      payload: payload,
      headers: {
        Authorization: `Bearer ${auth}`,
      },
    };
  },
};

module.exports = ServerInjectionFunctionHelper;
