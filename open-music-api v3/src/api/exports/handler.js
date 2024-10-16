const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistService, validator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportNotesHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const userId = request.auth.credentials.id;

    const message = {
      userId,
      targetEmail: request.payload.targetEmail,
      playlistId,
    };

    await this._playlistService.verifyPlaylistAccess(playlistId, userId);

    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
