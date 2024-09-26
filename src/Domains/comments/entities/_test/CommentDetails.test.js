const CommentDetails = require('../CommentDetails');

describe('a CommentDetails', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {
      content: 'something',
      date: 'something',
      username: 'something',
      replies: [],
    };

    expect(() => new CommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
      replies: '[]',
    };

    expect(() => new CommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
      replies: [],
    };

    const commentDetails = new CommentDetails(payload);
    expect(commentDetails).toBeDefined();
  });
});
