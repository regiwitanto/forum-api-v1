const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoking addNewThread directly', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.addNewThread('', '')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });

  it('should throw error when invoking getThreadById directly', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.getThreadById('')).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });

  it('should throw error when invoking verifyThreadAvailability directly', async () => {
    const threadRepository = new ThreadRepository();
    await expect(
      threadRepository.verifyThreadAvailability('')
    ).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
