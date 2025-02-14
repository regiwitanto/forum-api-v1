const NewThread = require('../../../Domains/threads/entities/NewThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this.threadRepository = threadRepository;
  }

  async execute(threadDetails, user) {
    const newThread = new NewThread(threadDetails);
    return this.threadRepository.addNewThread(newThread, user);
  }
}

module.exports = AddThreadUseCase;
