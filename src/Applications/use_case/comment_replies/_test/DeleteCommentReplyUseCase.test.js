const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const OwnerValidator = require('../../../security/OwnerValidator');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should orchestrating the delete comment reply', async () => {
    const useCaseCommentReplyId = 'reply-212';
    const useCaseCommentId = 'comment-212';
    const useCaseThreadId = 'thread-212';
    const useCaseCredential = 'user-212';

    const commentAvailable = {
      id: useCaseCommentReplyId,
      user_id: useCaseCredential,
    };

    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockOwnerValidator = new OwnerValidator();

    mockCommentReplyRepository.getCommentReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentAvailable));
    mockOwnerValidator.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReplyRepository.deleteCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      ownerValidator: mockOwnerValidator,
    });

    await deleteCommentReplyUseCase.execute(
      useCaseCommentReplyId,
      useCaseThreadId,
      useCaseCommentId,
      useCaseCredential
    );

    expect(mockCommentReplyRepository.getCommentReplyById).toBeCalledWith(
      useCaseCommentReplyId
    );
    expect(mockOwnerValidator.verifyOwner).toBeCalledWith(
      useCaseCredential,
      commentAvailable.user_id,
      'comment reply'
    );
  });
});
