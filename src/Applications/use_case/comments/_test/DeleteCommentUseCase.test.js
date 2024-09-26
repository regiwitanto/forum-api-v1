const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const OwnerValidator = require('../../../security/OwnerValidator');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment', async () => {
    const useCaseCommentId = 'comment-212';
    const useCaseThreadId = 'thread-212';
    const useCaseCredential = 'user-212';

    const commentAvailable = {
      id: useCaseCommentId,
      user_id: useCaseCredential,
    };

    const mockCommentRepository = new CommentRepository();
    const mockOwnerValidator = new OwnerValidator();

    mockCommentRepository.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentAvailable));
    mockOwnerValidator.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      ownerValidator: mockOwnerValidator,
    });

    await deleteCommentUseCase.execute(
      useCaseCommentId,
      useCaseThreadId,
      useCaseCredential
    );

    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      useCaseCommentId
    );
    expect(mockOwnerValidator.verifyOwner).toBeCalledWith(
      useCaseCredential,
      commentAvailable.user_id,
      'comment'
    );
  });
});
