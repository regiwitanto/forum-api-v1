const NewComment = require('../NewComment');

describe('NewComment Entity', () => {
  it('should throw an error when payload does not contain required property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw an error when content is not a string', () => {
    const payload = {
      content: 123, // Should be a string
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw an error when content is an empty string', () => {
    const payload = {
      content: '    ', // Empty string after trim
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.CANNOT_BE_EMPTY_STRING'
    );
  });

  it('should create NewComment object correctly when payload is valid', () => {
    const payload = {
      content: 'this is content',
    };

    const newComment = new NewComment(payload);

    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.content).toEqual(payload.content);
  });
});
