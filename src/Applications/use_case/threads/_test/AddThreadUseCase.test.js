const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../../Domains/threads/entities/AddedThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrate adding a new thread', async () => {
    const newThreadData = {
      title: 'Title for thread',
      body: 'This is body for thread',
    };
    const user = { id: 'user-123' };

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: newThreadData.title,
      owner: user.id,
    });

    const threadRepo = new ThreadRepository();
    threadRepo.addNewThread = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: newThreadData.title,
        owner: user.id,
      })
    );

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: threadRepo,
    });

    const result = await addThreadUseCase.execute(newThreadData, user);

    expect(threadRepo.addNewThread).toHaveBeenCalledWith(newThreadData, user);
    expect(result).toStrictEqual(expectedAddedThread);
  });
});
