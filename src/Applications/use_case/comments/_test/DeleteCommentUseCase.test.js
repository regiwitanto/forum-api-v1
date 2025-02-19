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
      content: 'This is a comment',
      created_at: new Date(),
      user_id: userId,
      thread_id: threadId,
      is_deleted: false,
    };

    const commentRepo = new CommentRepository();
    const ownerValidator = new OwnerValidator();

    commentRepo.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(existingComment));
    ownerValidator.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    commentRepo.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

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
    expect(commentRepo.deleteComment).toBeCalledWith(
      commentId,
      threadId,
      userId
    );
  });
});
