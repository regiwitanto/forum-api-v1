const NewCommentReply = require('../NewCommentReply');

describe('NewCommentReply Entity', () => {
  it('should throw error when payload does not contain required property', () => {
    const incompletePayload = {};

    expect(() => new NewCommentReply(incompletePayload)).toThrowError(
      'NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contains incorrect data type', () => {
    const invalidPayload = {
      content: 123, // should be a string
    };

    expect(() => new NewCommentReply(invalidPayload)).toThrowError(
      'NEW_COMMENT_REPLY.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error when content is an empty string', () => {
    const emptyStringPayload = {
      content: '    ',
    };

    expect(() => new NewCommentReply(emptyStringPayload)).toThrowError(
      'NEW_COMMENT_REPLY.CANNOT_BE_EMPTY_STRING'
    );
  });

  it('should create NewCommentReply object correctly with valid payload', () => {
    const validPayload = {
      content: 'this is content',
    };

    const newCommentReply = new NewCommentReply(validPayload);

    expect(newCommentReply).toBeDefined();
    expect(newCommentReply.content).toEqual(validPayload.content);
  });
});
