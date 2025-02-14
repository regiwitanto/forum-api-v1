const AddedCommentReply = require('../AddedCommentReply');

describe('AddedCommentReply Entity', () => {
  it('should throw error when required properties are missing', () => {
    const incompletePayload = {
      id: 'thread-123',
      title: 'This is title',
      user: 'dad',
    };

    expect(() => new AddedCommentReply(incompletePayload)).toThrowError(
      'ADDED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when properties have incorrect data types', () => {
    const invalidPayload = {
      id: 'thread-123',
      content: 'This is title',
      owner: 123, // should be a string
    };

    expect(() => new AddedCommentReply(invalidPayload)).toThrowError(
      'ADDED_COMMENT_REPLY.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED'
    );
  });

  it('should create an AddedCommentReply object correctly', () => {
    const validPayload = {
      id: 'comment-123',
      content: 'This is content',
      owner: 'user-123',
    };

    const addedCommentReply = new AddedCommentReply(validPayload);

    expect(addedCommentReply).toEqual({
      id: validPayload.id,
      content: validPayload.content,
      owner: validPayload.owner,
    });
  });
});
