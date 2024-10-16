const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumService, albumValidator) {
    this._service = albumService;
    this._validator = albumValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    await this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._service.getAlbumById(albumId);

    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    await this._validator.validateAlbumPayload(request.payload);

    const { albumId } = request.params;

    await this._service.editAlbumById(albumId, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;
    await this._service.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;
    await this._service.addAlbumLikes(albumId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan ke album',
    });
    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { albumId } = request.params;
    const { likesCount, src } = await this._service.getAlbumLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: Number(likesCount),
      },
    });

    if (src === 'cache') {
      response.header('X-data-source', 'cache');
    }

    response.code(200);
    return response;
  }

  async deleteAlbumLikesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;
    await this._service.deleteAlbumLikes(albumId, credentialId);

    return {
      status: 'success',
      message: 'like berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
