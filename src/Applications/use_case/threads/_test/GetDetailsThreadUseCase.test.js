const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const GetDetailsThreadUseCase = require('../GetDetailsThreadUseCase');

describe('GetDetailsThreadUseCase', () => {
  const alice = { id: 'user-1', username: 'Alice' };
  const bob = { id: 'user-2', username: 'Bob' };

  const sampleThread = {
    id: 'thread-1',
    title: 'Sample Thread Title',
    body: 'This is a sample thread body.',
    created_at: '2023-01-01 10:00:00',
    user_id: alice.id,
  };

  const sampleComments = [
    {
      id: 'comment-1',
      content: 'First comment',
      created_at: '2023-01-02 11:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
    },
    {
      id: 'comment-2',
      content: 'Second comment',
      created_at: '2023-01-02 12:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
    },
    {
      id: 'comment-3',
      content: 'Third comment',
      created_at: '2023-01-02 13:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
    },
  ];

  const sampleReplies = [
    {
      id: 'reply-1',
      content: 'First reply',
      created_at: '2023-01-03 14:00:00',
      user_id: bob.id,
      comment_id: 'comment-1',
    },
    {
      id: 'reply-2',
      content: 'Second reply',
      created_at: '2023-01-03 15:00:00',
      user_id: alice.id,
      comment_id: 'comment-1',
    },
    {
      id: 'reply-3',
      content: 'Third reply',
      created_at: '2023-01-03 16:00:00',
      user_id: alice.id,
      comment_id: 'comment-1',
    },
    {
      id: 'reply-4',
      content: 'Fourth reply',
      created_at: '2023-01-03 17:00:00',
      user_id: alice.id,
      comment_id: 'comment-1',
    },
  ];

  let commentReplyRepo, commentRepo, threadRepo, userRepo;

  beforeEach(() => {
    commentReplyRepo = new CommentReplyRepository();
    commentRepo = new CommentRepository();
    threadRepo = new ThreadRepository();
    userRepo = new UserRepository();
  });

  it('should retrieve thread details with comments and replies', async () => {
    threadRepo.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(sampleThread));
    userRepo.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === alice.id) return Promise.resolve(alice);
      if (userId === bob.id) return Promise.resolve(bob);
    });
    commentRepo.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(sampleComments));
    commentReplyRepo.getCommentReplyByCommentId = jest
      .fn()
      .mockImplementation((commentId) => {
        if (commentId === 'comment-1') return Promise.resolve(sampleReplies);
        return Promise.resolve([]);
      });

    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      commentReplyRepository: commentReplyRepo,
      commentRepository: commentRepo,
      threadRepository: threadRepo,
      userRepository: userRepo,
    });

    const threadDetails = await getDetailsThreadUseCase.execute(
      sampleThread.id
    );

    expect(threadDetails.comments).toHaveLength(3);
    expect(threadDetails.comments[0].replies).toHaveLength(4);
    expect(threadDetails.comments[0].replies[0].username).toBe(bob.username);
    expect(threadDetails.comments[0].replies[1].username).toBe(alice.username);
  });

  it('should retrieve thread details when no comments are present', async () => {
    threadRepo.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(sampleThread));
    userRepo.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === alice.id) return Promise.resolve(alice);
      if (userId === bob.id) return Promise.resolve(bob);
    });
    commentRepo.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    const getDetailsThreadUseCase = new GetDetailsThreadUseCase({
      commentReplyRepository: commentReplyRepo,
      commentRepository: commentRepo,
      threadRepository: threadRepo,
      userRepository: userRepo,
    });

    const threadDetails = await getDetailsThreadUseCase.execute(
      sampleThread.id
    );

    expect(threadDetails.comments).toHaveLength(0);
  });
});
