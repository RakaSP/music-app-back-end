const autoBind = require('auto-bind');

class UsersHandler {
  constructor(userService, userValidator) {
    this._service = userService;
    this._validator = userValidator;
    autoBind(this);
  }

  async postUserHandler(request, h) {
    await this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
