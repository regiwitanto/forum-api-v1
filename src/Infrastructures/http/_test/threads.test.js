const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require('../../../../tests/ServerInjectionFunctionHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and return correct added thread', async () => {
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
        body: 'This is first thread',
      };

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

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 if no authorization', async () => {
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
        body: 'This is first thread',
      };
      const accessToken = 'wrongtoken';

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 if bad payload', async () => {
      const server = await createServer(container);
      const requestPayload = {
        title: 'First Thread',
      };

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

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: login,
      });

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'cannot make a new thread, payload not correct'
      );
    });
  });

  describe('when GET /threads/{threadsId}', () => {
    it('it should display the right thread details', async () => {
      const commentPayload = {
        content: 'This is comment',
      };

      const threadPayload = {
        title: 'First Thread',
        body: 'This is first thread',
      };

      const userPayload = {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      };

      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        content: 'This is reply',
      };

      const server = await createServer(container);

      await injection(server, addUserOption(userPayload));
      const auth = await injection(server, addAuthOption(loginPayload));
      const authToken = JSON.parse(auth.payload)?.data?.accessToken;

      const thread = await injection(
        server,
        addThreadOption(threadPayload, authToken)
      );
      const threadId = JSON.parse(thread.payload)?.data?.addedThread.id;

      const comment = await injection(
        server,
        addCommentOption(commentPayload, authToken, threadId)
      );
      const commentId = JSON.parse(comment.payload)?.data?.addedComment.id;

      await injection(
        server,
        addCommentReplyOption(requestPayload, authToken, threadId, commentId)
      );

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      const responseJson = JSON.parse(response.payload);
      
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
