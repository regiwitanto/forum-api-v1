const AddedComment = require('../AddedComment');

describe('AddedComment Entity', () => {
  it('should throw error when payload does not contain needed properties', () => {
    const payload = {
      id: 'thread-123',
      title: 'This is title',
      user: 'dad',
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload properties do not meet data type requirements', () => {
    const payload = {
      id: 'thread-123',
      content: 'This is title',
      owner: 123, // Should be a string, not a number
    };

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.PROPERTY_NOT_MEET_DATA_TYPE_NEEDED'
    );
  });

  it('should create AddedComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'This is content',
      owner: 'user-123',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
