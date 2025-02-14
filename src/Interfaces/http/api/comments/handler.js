const AddCommentUseCase = require('../../../../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comments/DeleteCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const { id: ownerId } = request.auth.credentials;
    const { threadId } = request.params;

    const addedComment = await addCommentUseCase.execute(
      request.payload,
      threadId,
      ownerId
    );

    return this._createResponse(h, addedComment);
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(commentId, threadId, credentialId);

    return this._createSuccessResponse();
  }

  _createResponse(h, addedComment) {
    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  _createSuccessResponse() {
    return {
      status: 'success',
    };
  }
}

module.exports = CommentHandler;
