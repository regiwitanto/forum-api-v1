const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(threadDetails, user) {
    const newThread = new NewThread(threadDetails);
    const addedThread = await this.threadRepository.addNewThread(
      newThread,
      user
    );

    return new AddedThread(addedThread);
  }
}

module.exports = AddThreadUseCase;
