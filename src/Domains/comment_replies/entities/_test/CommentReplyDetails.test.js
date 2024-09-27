const CommentReplyDetails = require('../CommentReplyDetails');

describe('a CommentReplyDetails', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      content: 'something',
      date: 'something',
      username: 'something',
    };

    expect(() => new CommentReplyDetails(payload)).toThrowError(
      'COMMENT_REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 123,
      username: 'something',
    };

    expect(() => new CommentReplyDetails(payload)).toThrowError(
      'COMMENT_REPLY_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
    };

    const commentReplyDetails = new CommentReplyDetails(payload);
    expect(commentReplyDetails).toBeDefined();
  });
});
