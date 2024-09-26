const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
} = require('../../../../tests/ServerInjectionFunctionHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  const threadPayload = {
    title: 'First Thread',
    body: 'This is first thread',
  };

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

  const loginPayload = {
    username: 'dicoding',
    password: 'secret',
  };

  const notOwnerLoginPayload = {
    username: 'ichsan',
    password: 'secret',
  };

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
      const requestPayload = {
        content: 'This is comment',
      };

      await injection(server, addUserOption(userPayload));

      const auth = await injection(server, addAuthOption(loginPayload));

      const {
        data: { accessToken },
      } = JSON.parse(auth.payload);

      const thread = await injection(
        server,
        addThreadOption(threadPayload, accessToken)
      );

      const {
        data: {
          addedThread: { id },
        },
      } = JSON.parse(thread.payload);

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
