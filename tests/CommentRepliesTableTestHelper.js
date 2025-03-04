/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addCommentReply({
    id = 'reply-123',
    content = 'This is a reply',
    created_at = new Date(),
    user_id = 'user-123',
    thread_id = 'thread-123',
    comment_id = 'comment-123',
    is_deleted = false,
  }) {
    const query = {
      text: 'INSERT INTO comment_replies VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, user_id',
      values: [
        id,
        content,
        created_at,
        user_id,
        thread_id,
        comment_id,
        is_deleted,
      ],
    };

    await pool.query(query);
  },

  async getCommentReplyById(commentReplyId) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [commentReplyId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableTestHelper;
