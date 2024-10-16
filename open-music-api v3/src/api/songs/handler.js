const autoBind = require('auto-bind');

class SongsHandler {
  constructor(songService, songValidator) {
    this._service = songService;
    this._validator = songValidator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    await this._validator.validateSongPayload(request.payload);

    const {
      title, year, performer, genre, duration, albumId,
    } = request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const titleParam = request.query.title;
    const performerParam = request.query.performer;

    const songs = await this._service.getSongs(titleParam, performerParam);
    // console.log(songs);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songId } = request.params;
    const song = await this._service.getSongById(songId);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    await this._validator.validateSongPayload(request.payload);
    const { songId } = request.params;

    await this._service.editSongById(songId, request.payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songId } = request.params;
    await this._service.deleteSongById(songId);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
