const pool = require('../../database/postgres/pool');
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const {
  injection,
  addUserOption,
  addThreadOption,
  addAuthOption,
  addCommentOption,
  addCommentReplyOption,
} = require('../../../../tests/ServerInjectionFunctionHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
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

  const requestPayload = {
    content: 'This is reply',
  };

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /replies', () => {
    it('should response 201 and return correct added comment reply', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });
  });

  describe('when delete /replies/{commentReplyId}', () => {
    it('should response 200 with status success', async () => {
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

      const commentReply = await injection(
        server,
        addCommentReplyOption(requestPayload, authToken, threadId, commentId)
      );
      const commentReplyId = JSON.parse(commentReply.payload)?.data?.addedReply
        .id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${commentReplyId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should throw 403 if user not the owner', async () => {
      const server = await createServer(container);

      await injection(server, addUserOption(userPayload));
      await injection(server, addUserOption(notOwnerPayload));

      const authOwner = await injection(server, addAuthOption(loginPayload));
      const authNotOwner = await injection(
        server,
        addAuthOption(notOwnerLoginPayload)
      );

      const ownerToken = JSON.parse(authOwner.payload).data.accessToken;
      const notOwnerToken = JSON.parse(authNotOwner.payload).data.accessToken;

      const thread = await injection(
        server,
        addThreadOption(threadPayload, ownerToken)
      );
      const threadId = JSON.parse(thread.payload).data.addedThread.id;

      const commentAdded = await injection(
        server,
        addCommentOption(commentPayload, ownerToken, threadId)
      );
      const commentId = JSON.parse(commentAdded.payload).data.addedComment.id;

      const commentReply = await injection(
        server,
        addCommentReplyOption(requestPayload, ownerToken, threadId, commentId)
      );
      const commentReplyId = JSON.parse(commentReply.payload)?.data?.addedReply
        .id;

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${commentReplyId}`,
        headers: {
          Authorization: `Bearer ${notOwnerToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
