const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository Interface', () => {
  let commentReplyRepository;

  beforeEach(() => {
    commentReplyRepository = new CommentReplyRepository();
  });

  const methodsToTest = [
    { method: 'addCommentReply', args: ['', '', '', ''] },
    { method: 'getCommentReplyById', args: [''] },
    { method: 'getCommentReplyByCommentId', args: [''] },
    { method: 'deleteCommentReply', args: ['', '', '', ''] },
  ];

  methodsToTest.forEach(({ method, args }) => {
    it(`should throw error when calling abstract method ${method}`, async () => {
      await expect(
        commentReplyRepository[method](...args)
      ).rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
  });
});
