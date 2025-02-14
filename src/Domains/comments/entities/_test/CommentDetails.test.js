const CommentDetails = require('../CommentDetails');

describe('CommentDetails Entity', () => {
  it('should throw an error when payload does not contain required properties', () => {
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

  it('should throw an error when payload contains properties with wrong data types', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
      replies: '[]', // Should be an array, not a string
    };

    expect(() => new CommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should create CommentDetails object correctly when payload is valid', () => {
    const payload = {
      id: 'something',
      content: 'something',
      date: 'something',
      username: 'something',
      replies: [],
    };

    const commentDetails = new CommentDetails(payload);

    expect(commentDetails).toBeInstanceOf(CommentDetails);
    expect(commentDetails.id).toEqual(payload.id);
    expect(commentDetails.content).toEqual(payload.content);
    expect(commentDetails.date).toEqual(payload.date);
    expect(commentDetails.username).toEqual(payload.username);
    expect(commentDetails.replies).toEqual(payload.replies);
  });
});
