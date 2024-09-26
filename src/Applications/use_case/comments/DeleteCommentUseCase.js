class DeleteCommentUseCase {
  constructor({ commentRepository, ownerValidator }) {
    this._commentRepository = commentRepository;
    this._ownerValidator = ownerValidator;
  }

  async execute(useCaseCommentId, useCaseThreadId, useCaseCredential) {
    const comment = await this._commentRepository.getCommentById(
      useCaseCommentId
    );
    await this._ownerValidator.verifyOwner(
      useCaseCredential,
      comment.user_id,
      'comment'
    );
    return await this._commentRepository.deleteComment(
      comment.id,
      useCaseThreadId,
      useCaseCredential
    );
  }
}

module.exports = DeleteCommentUseCase;
