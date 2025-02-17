const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewCommentReply = require('../../../Domains/comment_replies/entities/NewCommentReply');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');
const AddedCommentReply = require('../../../Domains/comment_replies/entities/AddedCommentReply');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentReplyRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';
  const commentId = 'comment-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
    await CommentsTableTestHelper.addComment({
      id: commentId,
      user_id: userId,
      thread_id: threadId,
    });
  });

  afterEach(async () => {
    await CommentRepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addCommentReply function', () => {
    it('should persist added comment reply', async () => {
      const newCommentReply = new NewCommentReply({
        content: 'This is a reply',
      });
      const fakeIdGenerator = () => '222';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentReplyRepositoryPostgres.addCommentReply(
        newCommentReply.content,
        threadId,
        commentId,
        userId
      );

      const comment = await CommentRepliesTableTestHelper.getCommentReplyById(
        'reply-222'
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment reply correctly', async () => {
      const newCommentReply = new NewCommentReply({
        content: 'This is a reply',
      });
      const fakeIdGenerator = () => '222';
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedCommentReply =
        await commentReplyRepositoryPostgres.addCommentReply(
          newCommentReply.content,
          threadId,
          commentId,
          userId
        );

      expect(addedCommentReply).toStrictEqual(
        new AddedCommentReply({
          id: 'reply-222',
          content: 'This is a reply',
          owner: userId,
        })
      );
    });
  });

  describe('getCommentReplyById', () => {
    it('should return NotFoundError when comment not found', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentReplyRepositoryPostgres.getCommentReplyById('wrong-comment')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment correctly', async () => {
      const expectedCommentReply = {
        id: 'reply-333',
        content: 'This is a reply',
        created_at: new Date(),
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        is_deleted: false,
      };

      await CommentRepliesTableTestHelper.addCommentReply(expectedCommentReply);
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      const comment = await commentReplyRepositoryPostgres.getCommentReplyById(
        'reply-333'
      );

      expect(comment).toBeDefined();
      expect(comment.id).toEqual(expectedCommentReply.id);
      expect(comment.content).toEqual(expectedCommentReply.content);
      expect(comment.created_at).toEqual(expectedCommentReply.created_at);
      expect(comment.user_id).toEqual(userId);
      expect(comment.thread_id).toEqual(threadId);
      expect(comment.comment_id).toEqual(commentId);
      expect(comment.is_deleted).toEqual(expectedCommentReply.is_deleted);
    });
  });

  describe('getCommentReplyByCommentId', () => {
    it('should return empty array when comment not found', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      const commentReplies =
        await commentReplyRepositoryPostgres.getCommentReplyByCommentId(
          commentId
        );

      expect(Array.isArray(commentReplies)).toBeTruthy();
      expect(commentReplies).toHaveLength(0);
    });

    it('should return comment correctly', async () => {
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-333',
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: 'Reply 333',
        date: new Date(),
        is_deleted: false,
      });
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-222',
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: 'Reply 222',
        date: new Date(),
        is_deleted: false,
      });
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-111',
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        content: 'Reply 111',
        date: new Date(),
        is_deleted: false,
      });

      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      const comments =
        await commentReplyRepositoryPostgres.getCommentReplyByCommentId(
          commentId
        );

      expect(comments).toHaveLength(3);
      expect(comments).toEqual([
        {
          id: 'reply-333',
          user_id: userId,
          thread_id: threadId,
          comment_id: commentId,
          content: 'Reply 333',
          created_at: expect.any(Date),
          is_deleted: false,
        },
        {
          id: 'reply-222',
          user_id: userId,
          thread_id: threadId,
          comment_id: commentId,
          content: 'Reply 222',
          created_at: expect.any(Date),
          is_deleted: false,
        },
        {
          id: 'reply-111',
          user_id: userId,
          thread_id: threadId,
          comment_id: commentId,
          content: 'Reply 111',
          created_at: expect.any(Date),
          is_deleted: false,
        },
      ]);
    });
  });

  describe('deleteCommentReply', () => {
    it('should delete comment correctly and persist comment', async () => {
      await CommentRepliesTableTestHelper.addCommentReply({
        id: 'reply-333',
        user_id: userId,
        thread_id: threadId,
        comment_id: commentId,
        is_deleted: false,
      });
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      await commentReplyRepositoryPostgres.deleteCommentReply(
        'reply-333',
        threadId,
        commentId,
        userId
      );
      const deletedCommentReply =
        await CommentRepliesTableTestHelper.getCommentReplyById('reply-333');

      expect(deletedCommentReply[0].is_deleted).toEqual(true);
      expect(deletedCommentReply[0].content).toEqual('This is a reply');
    });

    it('should return InvariantError when failed to delete comment', async () => {
      const commentReplyRepositoryPostgres = new CommentReplyRepositoryPostgres(
        pool,
        {}
      );

      await expect(
        commentReplyRepositoryPostgres.deleteCommentReply(
          'reply-333',
          'thread-121',
          'comment-111',
          'user-123'
        )
      ).rejects.toThrowError(InvariantError);
    });
  });
});
