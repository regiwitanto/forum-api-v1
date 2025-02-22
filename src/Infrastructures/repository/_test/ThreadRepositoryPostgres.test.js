const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addNewThread function', () => {
    it('should persist added thread', async () => {
      const newThread = new NewThread({
        title: 'First thread',
        body: 'This is a new thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await threadRepositoryPostgres.addNewThread(newThread, userId);

      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      const newThread = new NewThread({
        title: 'First thread',
        body: 'This is a new thread',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const addedThread = await threadRepositoryPostgres.addNewThread(
        newThread,
        userId
      );

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'First thread',
          owner: userId,
        })
      );
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError if no thread found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadById('thread-521')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should get the right thread', async () => {
      const expectedThread = {
        id: 'thread-521',
        title: 'Thread test',
        body: 'Body of the thread',
        created_at: new Date(),
        user_id: userId,
      };

      await ThreadsTableTestHelper.addThread(expectedThread);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-521');

      expect(thread).toBeDefined();
      expect(thread.id).toEqual(expectedThread.id);
      expect(thread.title).toEqual(expectedThread.title);
      expect(thread.body).toEqual(expectedThread.body);
      expect(thread.created_at).toEqual(expectedThread.created_at);
      expect(thread.user_id).toEqual(expectedThread.user_id);
    });
  });

  describe('verifyThreadAvailability function', () => {
    it('should throw NotFoundError when thread is not available', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-521')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw error when thread is available', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-521',
        title: 'Thread test',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.verifyThreadAvailability('thread-521')
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
