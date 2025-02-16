const NewCommentReply = require('../../../Domains/comment_replies/entities/NewCommentReply');
const AddedCommentReply = require('../../../Domains/comment_replies/entities/AddedCommentReply');

class AddCommentReplyUseCase {
  constructor({
    commentReplyRepository,
    commentRepository,
    threadRepository,
    userRepository,
  }) {
    this._commentReplyRepository = commentReplyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(
    useCasePayload,
    useCaseThreadId,
    useCaseCommentId,
    useCaseCredential
  ) {
    const { content } = new NewCommentReply(useCasePayload);
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );
    await this._threadRepository.verifyThreadAvailability(useCaseThreadId);
    const user = await this._userRepository.getUserById(useCaseCredential);

    const addedCommentReplyData =
      await this._commentReplyRepository.addCommentReply(
        content,
        useCaseThreadId,
        comment.id,
        user.id
      );

    return new AddedCommentReply(addedCommentReplyData);
  }
}

module.exports = AddCommentReplyUseCase;
