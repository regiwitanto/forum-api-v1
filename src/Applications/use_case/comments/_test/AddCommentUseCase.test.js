const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const NewComment = require('../../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment', async () => {
    const useCasePayload = {
      content: 'This is comment',
    };

    const useCaseCredential = {
      id: 'user-123',
    };

    const useCaseThreadId = {
      id: 'thread-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCaseCredential.id,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseThreadId));
    mockUserRepository.getUserById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCaseCredential));
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      useCasePayload,
      useCaseThreadId.id,
      useCaseCredential.id
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: useCaseCredential.id,
      })
    );

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCaseThreadId.id
    );
    expect(mockUserRepository.getUserById).toBeCalledWith(useCaseCredential.id);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
      }).content,
      useCaseThreadId.id,
      useCaseCredential.id
    );
  });
});
