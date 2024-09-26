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
          owner: 'user-123',
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
      await ThreadsTableTestHelper.addThread({
        id: 'thread-521',
        title: 'Thread test',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadById('thread-521');

      expect(thread.title).toEqual('Thread test');
    });
  });
});
