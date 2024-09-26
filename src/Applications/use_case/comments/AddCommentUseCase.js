const NewComment = require('../../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    const thread = await this._threadRepository.getThreadById(useCaseThreadId);
    const user = await this._userRepository.getUserById(useCaseCredential);

    return await this._commentRepository.addComment(
      content,
      thread.id,
      user.id
    );
  }
}

module.exports = AddCommentUseCase;
