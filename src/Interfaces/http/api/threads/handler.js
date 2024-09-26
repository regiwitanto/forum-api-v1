const AddThreadUseCase = require('../../../../Applications/use_case/threads/AddThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._containter = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._containter.getInstance(
      AddThreadUseCase.name
    );
    const { id: userId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(request.payload, userId);
    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadHandler;
