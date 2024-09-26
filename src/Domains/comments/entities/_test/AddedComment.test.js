const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'This is title',
      user: 'dad',
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload property did not meet data type needed', () => {
    const payload = {
      id: 'thread-123',
      content: 'This is title',
      owner: 123,
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED'
    );
  });

  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'This is content',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
