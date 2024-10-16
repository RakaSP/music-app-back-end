const autoBind = require('auto-bind');

class CollaborationHandler {
  constructor(CollaborationService, PlaylistService, CollaborationValidator) {
    this._collaborationService = CollaborationService;
    this._playlistService = PlaylistService;
    this._validator = CollaborationValidator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationService.addCollaboration(
      playlistId,
      userId,
      credentialId,
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationService.deleteCollaboration(playlistId, userId);
    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;
