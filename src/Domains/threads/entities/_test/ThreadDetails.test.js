const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'something',
      body: 'something',
      date: 'something',
      username: 'something',
      comments: [], // Missing 'id' property
    };

    expect(() => new ThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload contains wrong data type', () => {
    const payload = {
      id: 'something',
      title: 'something',
      body: 'something',
      date: 'something',
      username: 'something',
      comments: '[]', // Should be an array, not a string
    };

    expect(() => new ThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.PROPERTY_HAVE_WRONG_DATA_TYPE'
    );
  });

  it('should create ThreadDetails object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body content.',
      date: '2023-01-01',
      username: 'john_doe',
      comments: [],
    };

    const threadDetails = new ThreadDetails(payload);

    expect(threadDetails.id).toEqual(payload.id);
    expect(threadDetails.title).toEqual(payload.title);
    expect(threadDetails.body).toEqual(payload.body);
    expect(threadDetails.date).toEqual(payload.date);
    expect(threadDetails.username).toEqual(payload.username);
    expect(threadDetails.comments).toEqual(payload.comments);
  });
});
