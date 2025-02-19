const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const OwnerValidator = require('../../../security/OwnerValidator');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should orchestrate the deletion of a comment reply', async () => {
    const replyId = 'reply-212';
    const commentId = 'comment-212';
    const threadId = 'thread-212';
    const userId = 'user-212';

    const existingReply = {
      id: replyId,
      content: 'This is a reply',
      created_at: new Date(),
      user_id: userId,
      thread_id: threadId,
      comment_id: commentId,
      is_deleted: false,
    };

    const commentReplyRepo = new CommentReplyRepository();
    const ownerValidator = new OwnerValidator();

    commentReplyRepo.getCommentReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(existingReply));
    ownerValidator.verifyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    commentReplyRepo.deleteCommentReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteCommentReplyUseCase({
      commentReplyRepository: commentReplyRepo,
      ownerValidator: ownerValidator,
    });

    await deleteReplyUseCase.execute(replyId, threadId, commentId, userId);

    expect(commentReplyRepo.getCommentReplyById).toBeCalledWith(replyId);
    expect(ownerValidator.verifyOwner).toBeCalledWith(
      userId,
      existingReply.user_id,
      'comment reply'
    );
    expect(commentReplyRepo.deleteCommentReply).toBeCalledWith(
      replyId,
      threadId,
      commentId,
      userId
    );
  });
});
