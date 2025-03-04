const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrate the addition of a comment', async () => {
    const commentContent = { content: 'This is comment' };
    const user = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    const thread = { id: 'thread-123' };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: commentContent.content,
      owner: user.id,
    });

    const commentRepo = new CommentRepository();
    const threadRepo = new ThreadRepository();
    const userRepo = new UserRepository();

    threadRepo.verifyThreadAvailability = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    userRepo.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(user));
    commentRepo.addComment = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new AddedComment({
          id: 'comment-123',
          content: commentContent.content,
          owner: user.id,
        })
      )
    );

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: commentRepo,
      threadRepository: threadRepo,
      userRepository: userRepo,
    });

    const addedComment = await addCommentUseCase.execute(
      commentContent,
      thread.id,
      user.id
    );

    expect(threadRepo.verifyThreadAvailability).toBeCalledWith(thread.id);
    expect(userRepo.getUserById).toBeCalledWith(user.id);
    expect(commentRepo.addComment).toBeCalledWith(
      new NewComment({ content: commentContent.content }).content,
      thread.id,
      user.id
    );
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
