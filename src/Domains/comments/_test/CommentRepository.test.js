const CommentRepository = require('../CommentRepository');

describe('CommentRepository Interface', () => {
  it('should throw error when invoking abstract methods', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment('', '', '')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(commentRepository.getCommentById('')).rejects.toThrowError(
      'COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      commentRepository.getCommentByThreadId('')
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

    await expect(
      commentRepository.deleteComment('', '', '')
    ).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
