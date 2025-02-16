const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
    await ThreadsTableTestHelper.addThread({ id: threadId, user_id: userId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist added comment', async () => {
      const newComment = new NewComment({ content: 'This is a comment' });
      const fakeIdGenerator = () => '222';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      const comment = await CommentsTableTestHelper.getCommentById(
        'comment-222'
      );
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const newComment = new NewComment({ content: 'This is a comment' });
      const fakeIdGenerator = () => '222';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment.content,
        threadId,
        userId
      );

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-222',
          content: 'This is a comment',
          owner: userId,
        })
      );
    });
  });

  describe('getCommentById', () => {
    it('should return NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getCommentById('wrong-comment')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-333',
        user_id: userId,
        thread_id: threadId,
        content: 'This is a comment',
        is_deleted: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-333'
      );

      expect(comment.id).toEqual('comment-333');
      expect(comment.user_id).toEqual(userId);
      expect(comment.thread_id).toEqual(threadId);
      expect(comment.content).toEqual('This is a comment');
      expect(comment.is_delete).toEqual(false);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should return comments correctly', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-333',
        content: 'This is comment',
        user_id: 'user-123',
        thread_id: 'thread-123',
        date: new Date(),
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-222',
        content: 'This is comment',
        user_id: 'user-123',
        thread_id: 'thread-123',
        date: new Date(),
        is_delete: false,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-111',
        content: 'This is comment',
        user_id: 'user-123',
        thread_id: 'thread-123',
        date: new Date(),
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      expect(comments).toHaveLength(3);
      expect(comments).toEqual([
        {
          id: 'comment-333',
          content: 'This is comment',
          user_id: 'user-123',
          thread_id: 'thread-123',
          created_at: expect.any(Date),
          is_delete: false,
        },
        {
          id: 'comment-222',
          content: 'This is comment',
          user_id: 'user-123',
          thread_id: 'thread-123',
          created_at: expect.any(Date),
          is_delete: false,
        },
        {
          id: 'comment-111',
          content: 'This is comment',
          user_id: 'user-123',
          thread_id: 'thread-123',
          created_at: expect.any(Date),
          is_delete: false,
        },
      ]);
    });

    it('should return empty array if there is no comment correctly', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentByThreadId(
        threadId
      );

      expect(Array.isArray(comments)).toBeTruthy();
      expect(comments).toHaveLength(0);
    });
  });

  describe('deleteComment', () => {
    it('should delete comment correctly and persist comment', async () => {
      await CommentsTableTestHelper.addComment({
        id: 'comment-333',
        user_id: userId,
        thread_id: threadId,
        content: 'This is a comment',
        is_delete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment(
        'comment-333',
        threadId,
        userId
      );
      const deletedComment = await CommentsTableTestHelper.getCommentById(
        'comment-333'
      );

      expect(deletedComment[0].is_delete).toEqual(true);
      expect(deletedComment[0].content).toEqual('This is a comment');
    });

    it('should return InvariantError when failed to delete comment', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.deleteComment(
          'comment-111',
          'thread-121',
          'user-123'
        )
      ).rejects.toThrowError(InvariantError);
    });
  });
});
