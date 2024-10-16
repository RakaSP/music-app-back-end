const autoBind = require('auto-bind');

class UploadsHandler {
  constructor(storageService, albumService, validator) {
    this._storageService = storageService;
    this._albumService = albumService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { albumId } = request.params;
    const { cover } = request.payload;

    this._validator.validateImageHeader(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/covers/${filename}`;
    await this._albumService.putAlbumCover(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Cover berhasil ditambahkan ke album',
      data: {
        fileLocation: coverUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
