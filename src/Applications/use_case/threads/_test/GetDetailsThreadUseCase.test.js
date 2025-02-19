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
      is_deleted: true,
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
      expect(comment.content).toBe(
        expectedComment.is_deleted
          ? '**komentar telah dihapus**'
          : expectedComment.content
      );
      expect(comment.date).toBe(expectedComment.created_at);
      expect(comment.username).toBe(alice.username);

      if (comment.id === 'comment-1') {
        expect(comment.replies).toHaveLength(4);

        comment.replies.forEach((reply, replyIndex) => {
          const expectedReply = sampleReplies[replyIndex];
          expect(reply.id).toBe(expectedReply.id);
          expect(reply.content).toBe(
            expectedReply.is_deleted
              ? '**balasan telah dihapus**'
              : expectedReply.content
          );
          expect(reply.date).toBe(expectedReply.created_at);

          const expectedUser =
            expectedReply.user_id === alice.id ? alice.username : bob.username;
          expect(reply.username).toBe(expectedUser);
        });
      } else {
        expect(comment.replies).toHaveLength(0);
      }
    });

    expect(threadRepo.getThreadById).toBeCalledWith(sampleThread.id);
    expect(userRepo.getUserById).toBeCalledWith(alice.id);
    expect(commentRepo.getCommentByThreadId).toBeCalledWith(sampleThread.id);
    expect(commentReplyRepo.getCommentReplyByCommentId).toBeCalledWith(
      'comment-1'
    );
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
    expect(threadRepo.getThreadById).toBeCalledWith(sampleThread.id);
    expect(userRepo.getUserById).toBeCalledWith(alice.id);
    expect(commentRepo.getCommentByThreadId).toBeCalledWith(sampleThread.id);
  });

  it('should retrieve thread details with deleted comments', async () => {
    const deletedComment = {
      id: 'comment-4',
      content: 'This comment is deleted',
      created_at: '2023-01-02 14:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      is_deleted: true,
    };

    threadRepo.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(sampleThread));
    userRepo.getUserById = jest.fn().mockImplementation((userId) => {
      if (userId === alice.id) return Promise.resolve(alice);
      if (userId === bob.id) return Promise.resolve(bob);
    });
    commentRepo.getCommentByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([deletedComment]));
    commentReplyRepo.getCommentReplyByCommentId = jest
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

    expect(threadDetails.comments).toHaveLength(1);
    const comment = threadDetails.comments[0];
    expect(comment.id).toBe(deletedComment.id);
    expect(comment.content).toBe('**komentar telah dihapus**');
    expect(comment.date).toBe(deletedComment.created_at);
    expect(comment.username).toBe(alice.username);

    expect(threadRepo.getThreadById).toBeCalledWith(sampleThread.id);
    expect(userRepo.getUserById).toBeCalledWith(alice.id);
    expect(commentRepo.getCommentByThreadId).toBeCalledWith(sampleThread.id);
    expect(commentReplyRepo.getCommentReplyByCommentId).toBeCalledWith(
      deletedComment.id
    );
  });

  it('should retrieve thread details with deleted replies', async () => {
    const deletedReply = {
      id: 'reply-5',
      content: 'This reply is deleted',
      created_at: '2023-01-03 18:00:00',
      user_id: alice.id,
      thread_id: sampleThread.id,
      comment_id: 'comment-1',
      is_deleted: true,
    };

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
      .mockImplementation(() => Promise.resolve([deletedReply]));

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
    const comment = threadDetails.comments.find(
      (comment) => comment.id === 'comment-1'
    );
    expect(comment.replies).toHaveLength(1);
    const reply = comment.replies[0];
    expect(reply.id).toBe(deletedReply.id);
    expect(reply.content).toBe('**balasan telah dihapus**');
    expect(reply.date).toBe(deletedReply.created_at);
    expect(reply.username).toBe(alice.username);

    expect(threadRepo.getThreadById).toBeCalledWith(sampleThread.id);
    expect(userRepo.getUserById).toBeCalledWith(alice.id);
    expect(commentRepo.getCommentByThreadId).toBeCalledWith(sampleThread.id);
    expect(commentReplyRepo.getCommentReplyByCommentId).toBeCalledWith(
      'comment-1'
    );
  });
});
