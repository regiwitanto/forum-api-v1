const CommentReplyDetails = require('../CommentReplyDetails');

describe('CommentReplyDetails Entity', () => {
  it('should throw error when required properties are missing', () => {
    const incompletePayload = {
      content: 'something',
      date: 'something',
      username: 'something',
    };

    expect(() => new CommentReplyDetails(incompletePayload)).toThrowError(
      'COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when properties have incorrect data types', () => {
    const invalidPayload = {
      id: 'something',
      content: 'something',
      date: 123, // should be a string
      username: 'something',
    };

    expect(() => new CommentReplyDetails(invalidPayload)).toThrowError(
      'COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should create CommentReplyDetails object correctly with valid payload', () => {
    const validPayload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
    };

    const commentReplyDetails = new CommentReplyDetails(validPayload);

    expect(commentReplyDetails).toBeDefined();
    expect(commentReplyDetails.id).toEqual(validPayload.id);
    expect(commentReplyDetails.content).toEqual(validPayload.content);
    expect(commentReplyDetails.date).toEqual(validPayload.date);
    expect(commentReplyDetails.username).toEqual(validPayload.username);
  });
});
