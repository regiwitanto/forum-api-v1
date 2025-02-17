/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Rename is_delete to is_deleted in comments table
  pgm.renameColumn('comments', 'is_delete', 'is_deleted');

  // Rename is_delete to is_deleted in comment_replies table
  pgm.renameColumn('comment_replies', 'is_delete', 'is_deleted');
};

exports.down = (pgm) => {
  // Revert the changes if needed
  pgm.renameColumn('comments', 'is_deleted', 'is_delete');
  pgm.renameColumn('comment_replies', 'is_deleted', 'is_delete');
};
