const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload, useCaseThreadId, useCaseCredential) {
    const { content } = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);
    const user = await this._userRepository.getUserById(useCaseCredential);

    const addedCommentData = await this._commentRepository.addComment(
      content,
      useCaseThreadId,
      user.id
    );

    return new AddedComment(addedCommentData);
  }
}

module.exports = AddCommentUseCase;
