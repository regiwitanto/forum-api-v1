const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const OwnerValidator = require('../../../security/OwnerValidator');
const DeleteCommentUseCase = require('../DeleteCommentUseCase.js');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the deletion of a comment', async () => {
    const commentId = 'comment-212';
    const threadId = 'thread-212';
    const userId = 'user-212';

    const existingComment = {
      id: commentId,
      user_id: userId,
    };

    const commentRepo = new CommentRepository();
    const ownerValidator = new OwnerValidator();

    commentRepo.getCommentById = jest.fn().mockResolvedValue(existingComment);
    ownerValidator.verifyOwner = jest.fn().mockResolvedValue();
    commentRepo.deleteComment = jest.fn().mockResolvedValue();

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: commentRepo,
      ownerValidator: ownerValidator,
    });

    await deleteCommentUseCase.execute(commentId, threadId, userId);

    expect(commentRepo.getCommentById).toBeCalledWith(commentId);
    expect(ownerValidator.verifyOwner).toBeCalledWith(
      userId,
      existingComment.user_id,
      'comment'
    );
  });
});
