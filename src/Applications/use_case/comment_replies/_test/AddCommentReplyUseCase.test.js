const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const NewCommentReply = require('../../../../Domains/comment_replies/entities/NewCommentReply');
const AddedCommentReply = require('../../../../Domains/comment_replies/entities/AddedCommentReply');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');
const CommentReplyRepository = require('../../../../Domains/comment_replies/CommentReplyRepository');

describe('AddCommentReplyUseCase', () => {
  it('should orchestrate the addition of a comment reply', async () => {
    const replyContent = { content: 'This is comment' };
    const user = { id: 'user-123' };
    const thread = { id: 'thread-123' };
    const comment = { id: 'comment-123' };

    const expectedAddedReply = new AddedCommentReply({
      id: 'reply-123',
      content: replyContent.content,
      owner: user.id,
    });

    const commentReplyRepo = new CommentReplyRepository();
    const commentRepo = new CommentRepository();
    const threadRepo = new ThreadRepository();
    const userRepo = new UserRepository();

    commentRepo.getCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(comment));
    threadRepo.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    userRepo.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(user));
    commentReplyRepo.addCommentReply = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedCommentReply({
          id: 'reply-123',
          content: replyContent.content,
          owner: user.id,
        })
      )
    );

    const addReplyUseCase = new AddCommentReplyUseCase({
      commentReplyRepository: commentReplyRepo,
      commentRepository: commentRepo,
      threadRepository: threadRepo,
      userRepository: userRepo,
    });

    const addedCommentReply = await addReplyUseCase.execute(
      replyContent,
      thread.id,
      comment.id,
      user.id
    );

    expect(commentRepo.getCommentById).toBeCalledWith(comment.id);
    expect(threadRepo.verifyThreadAvailability).toBeCalledWith(thread.id);
    expect(userRepo.getUserById).toBeCalledWith(user.id);
    expect(commentReplyRepo.addCommentReply).toBeCalledWith(
      new NewCommentReply({ content: replyContent.content }).content,
      thread.id,
      comment.id,
      user.id
    );
    expect(addedCommentReply).toStrictEqual(expectedAddedReply);
  });
});
