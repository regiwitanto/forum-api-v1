const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain right property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error when payload is empty string', () => {
    const payload = {
      content: '    ',
    };

    expect(() => new NewComment(payload)).toThrowError(
      'NEW_COMMENT.CANNOT_BE_EMPTY_STRING'
    );
  });

  it('should create newComment object correctly', () => {
    const payload = {
      content: 'this is content',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
  });
});
