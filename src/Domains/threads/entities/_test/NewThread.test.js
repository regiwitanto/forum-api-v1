const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'something',
      content: 'something', // Should be 'body' instead of 'content'
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    const payload = {
      title: 'something',
      body: 123, // Body should be a string
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should throw error if the title is more than 50 characters', () => {
    const payload = {
      title:
        'something longer than 50 characters and it is really hard to have such an error and you did not find it in your last code',
      body: 'this is body',
    };

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.TITLE_EXCEED_CHAR_LIMIT'
    );
  });

  it('should create NewThread object correctly', () => {
    const payload = {
      title: 'This is a valid title',
      body: 'This is a valid body',
    };

    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });
});
