const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');
const CommentReplyDetails = require('../../../Domains/comment_replies/entities/CommentReplyDetails');

class GetDetailsThreadUseCase {
  constructor({
    userRepository,
    threadRepository,
    commentRepository,
    commentReplyRepository,
  }) {
    this.userRepository = userRepository;
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
    this.commentReplyRepository = commentReplyRepository;
  }

  async execute(threadId) {
    const threadData = await this.threadRepository.getThreadById(threadId);
    const { username: threadUsername } = await this.userRepository.getUserById(
      threadData.user_id
    );

    const threadDetails = new ThreadDetails({
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.created_at.toString(),
      username: threadUsername,
      comments: [],
    });

    const comments = await this.commentRepository.getCommentByThreadId(
      threadDetails.id
    );

    for (const comment of comments) {
      const { username: commentUsername } =
        await this.userRepository.getUserById(comment.user_id);

      const commentDetails = new CommentDetails({
        id: comment.id,
        content: comment.is_deleted
          ? '**komentar telah dihapus**'
          : comment.content,
        date: comment.created_at.toString(),
        username: commentUsername,
        replies: [],
      });

      const replies =
        await this.commentReplyRepository.getCommentReplyByCommentId(
          comment.id
        );

      for (const reply of replies) {
        const { username: replyUsername } =
          await this.userRepository.getUserById(reply.user_id);

        const replyDetails = new CommentReplyDetails({
          id: reply.id,
          content: reply.is_deleted
            ? '**balasan telah dihapus**'
            : reply.content,
          date: reply.created_at.toString(),
          username: replyUsername,
        });

        commentDetails.replies.push(replyDetails);
      }

      threadDetails.comments.push(commentDetails);
    }

    return threadDetails;
  }
}

module.exports = GetDetailsThreadUseCase;
