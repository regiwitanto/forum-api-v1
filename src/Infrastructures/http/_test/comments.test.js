const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
} = require('../../../../tests/ServerInjectionFunctionHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  const threadPayload = { title: 'First Thread', body: 'This is first thread' };
  const userPayload = {
    username: 'dicoding',
    password: 'secret',
    fullname: 'Dicoding Indonesia',
  };
  const notOwnerPayload = {
    username: 'ichsan',
    password: 'secret',
    fullname: 'Ichsan Sandy',
  };
  const loginPayload = { username: 'dicoding', password: 'secret' };
  const notOwnerLoginPayload = { username: 'ichsan', password: 'secret' };

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /comments', () => {
    it('should response 201 and return correct added comment', async () => {
      const server = await createServer(container);
      const requestPayload = { content: 'This is comment' };

      const authToken = await getAuthToken(server, userPayload, loginPayload);
      const threadId = await createThread(server, threadPayload, authToken);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe('when DELETE /comments/{commentId}', () => {
    it('should response 200 with status success', async () => {
      const server = await createServer(container);
      const commentPayload = { content: 'This is comment' };

      const authToken = await getAuthToken(server, userPayload, loginPayload);
      const threadId = await createThread(server, threadPayload, authToken);
      const commentId = await createComment(
        server,
        commentPayload,
        authToken,
        threadId
      );

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should throw 403 if user not the owner', async () => {
      const server = await createServer(container);
      const commentPayload = { content: 'This is comment' };

      const ownerToken = await getAuthToken(server, userPayload, loginPayload);
      const notOwnerToken = await getAuthToken(
        server,
        notOwnerPayload,
        notOwnerLoginPayload
      );

      const threadId = await createThread(server, threadPayload, ownerToken);
      const commentId = await createComment(
        server,
        commentPayload,
        ownerToken,
        threadId
      );

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${notOwnerToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });

  async function getAuthToken(server, userPayload, loginPayload) {
    await injection(server, addUserOption(userPayload));
    const auth = await injection(server, addAuthOption(loginPayload));
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
});
