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

      const authToken = await getAuthToken(
        server,
        'dicoding',
        'secret',
        'Dicoding Indonesia'
      );

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authToken}` },
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
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 if bad payload', async () => {
      const server = await createServer(container);
      const requestPayload = { title: 'First Thread' };

      const authToken = await getAuthToken(
        server,
        'dicoding',
        'secret',
        'Dicoding Indonesia'
      );

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authToken}` },
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
    it('should display the right thread details', async () => {
      const server = await createServer(container);

      const authToken = await getAuthToken(
        server,
        'dicoding',
        'secret',
        'Dicoding Indonesia'
      );
      const threadId = await createThread(
        server,
        { title: 'First Thread', body: 'This is first thread' },
        authToken
      );
      const commentId = await createComment(
        server,
        { content: 'This is comment' },
        authToken,
        threadId
      );

      await createCommentReply(
        server,
        { content: 'This is a reply' },
        authToken,
        threadId,
        commentId
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

  async function getAuthToken(server, username, password, fullname) {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: { username, password, fullname },
    });

    const auth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: { username, password },
    });

    return JSON.parse(auth.payload)?.data?.accessToken;
  }

  async function createThread(server, threadPayload, authToken) {
    const thread = await injection(
      server,
      addThreadOption(threadPayload, authToken)
    );
    return JSON.parse(thread.payload)?.data?.addedThread.id;
  }

  async function createComment(server, commentPayload, authToken, threadId) {
    const comment = await injection(
      server,
      addCommentOption(commentPayload, authToken, threadId)
    );
    return JSON.parse(comment.payload)?.data?.addedComment.id;
  }

  async function createCommentReply(
    server,
    requestPayload,
    authToken,
    threadId,
    commentId
  ) {
    await injection(
      server,
      addCommentReplyOption(requestPayload, authToken, threadId, commentId)
    );
  }
});
