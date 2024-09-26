const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require('../../../../tests/ServerInjectionFunctionHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and return correct added thread', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
        body: 'This is first thread',
      };

      // Add account
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const login = {
        username: 'dicoding',
        password: 'secret',
      };
      // login
      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      //Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 if no authorization', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
        body: 'This is first thread',
      };
      const accessToken = 'wrongtoken';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 if bad payload', async () => {
      // Arrange
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
      };
      // Add account
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      const login = {
        username: 'dicoding',
        password: 'secret',
      };
      // login
      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot make a new thread, payload not correct'
      );
    });
  });
});
