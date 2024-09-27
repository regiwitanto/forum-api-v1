const NewCommentReply = require('../NewCommentReply');

describe('a NewCommentReply entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {};

    expect(() => new NewCommentReply(payload)).toThrowError(
      'NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewCommentReply(payload)).toThrowError(
      'NEW_COMMENT_REPLY.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error when payload is empty string', () => {
    const payload = {
      content: '    ',
    };

    expect(() => new NewCommentReply(payload)).toThrowError(
      'NEW_COMMENT_REPLY.CANNOT_BE_EMPTY_STRING'
    );
  });

  it('should create newCommentReply object correctly', () => {
    const payload = {
      content: 'this is content',
    };

    const newCommentReply = new NewCommentReply(payload);

    expect(newCommentReply.content).toEqual(payload.content);
  });
});
