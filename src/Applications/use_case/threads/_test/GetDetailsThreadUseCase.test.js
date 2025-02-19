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
      is_deleted: false,
    },
    {
      id: 'comment-2',
      content: 'Second comment',
      created_at: '2023-01-02 12:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      is_deleted: false,
    },
    {
      id: 'comment-3',
      content: 'Third comment',
      created_at: '2023-01-02 13:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      is_deleted: false,
    },
  ];

  const sampleReplies = [
    {
      id: 'reply-1',
      content: 'First reply',
      created_at: '2023-01-03 14:00:00',
      user_id: bob.id,
      thread_id: sampleThread.id,
      comment_id: 'comment-1',
      is_deleted: false,
    },
    {
      id: 'reply-2',
      content: 'Second reply',
      created_at: '2023-01-03 15:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      comment_id: 'comment-1',
      is_deleted: false,
    },
    {
      id: 'reply-3',
      content: 'Third reply',
      created_at: '2023-01-03 16:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      comment_id: 'comment-1',
      is_deleted: false,
    },
    {
      id: 'reply-4',
      content: 'Fourth reply',
      created_at: '2023-01-03 17:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      comment_id: 'comment-1',
      is_deleted: false,
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

    expect(threadDetails).toBeDefined();
    expect(threadDetails.id).toBe(sampleThread.id);
    expect(threadDetails.title).toBe(sampleThread.title);
    expect(threadDetails.body).toBe(sampleThread.body);
    expect(threadDetails.date).toBe(sampleThread.created_at);
    expect(threadDetails.username).toBe(alice.username);

    expect(threadDetails.comments).toHaveLength(3);
    threadDetails.comments.forEach((comment, index) => {
      const expectedComment = sampleComments[index];
      expect(comment.id).toBe(expectedComment.id);
      expect(comment.content).toBe(expectedComment.content);
      expect(comment.date).toBe(expectedComment.created_at);
      expect(comment.username).toBe(alice.username);

      if (comment.id === 'comment-1') {
        expect(comment.replies).toHaveLength(4);

        comment.replies.forEach((reply, replyIndex) => {
          const expectedReply = sampleReplies[replyIndex];
          expect(reply.id).toBe(expectedReply.id);
          expect(reply.content).toBe(expectedReply.content);
          expect(reply.date).toBe(expectedReply.created_at);

          const expectedUser =
            expectedReply.user_id === alice.id ? alice.username : bob.username;
          expect(reply.username).toBe(expectedUser);
        });
      } else {
        expect(comment.replies).toHaveLength(0);
      }
    });
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
