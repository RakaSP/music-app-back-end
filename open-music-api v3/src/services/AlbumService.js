const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelAlbum } = require('../utils/albums');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModelSong } = require('../utils/songs/index');

class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const albumId = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [albumId, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan album');
    }

    return result.rows[0].id;
  }

  async getAlbumById(albumId) {
    const query = {
      text: `SELECT
        a.*,
        s.id AS song_id,
        s.title,
        s.performer
      FROM
        albums a
      LEFT JOIN
        songs s ON a.id = s.album_id
      WHERE
        a.id = $1`,
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const albumData = result.rows[0];
    const album = mapDBToModelAlbum(albumData);

    if (result.rows[0].song_id) {
      const songs = result.rows.map(mapDBToModelSong);

      album.songs = songs;
    } else {
      album.songs = [];
    }
    return album;
  }

  async editAlbumById(albumId, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui Album. Album tidak ditemukan');
    }
  }

  async deleteAlbumById(albumId) {
    // console.log(albumId);
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus Album. Album tidak ditemukan');
    }
  }

  async putAlbumCover(albumId, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Gagal menambah cover album. Album tidak ditemukan',
      );
    }
  }

  async addAlbumLikes(albumId, userId) {
    await this.findAlbum(albumId);
    await this.findAlbumLikes(albumId, userId);
    const userAlbumLikesId = `ual-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes values($1, $2, $3) RETURNING id',
      values: [userAlbumLikesId, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan likes pada album');
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getAlbumLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);

      return {
        likesCount: JSON.parse(result),
        src: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT count(id) as likes_count FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows[0].likes_count;

      await this._cacheService.set(
        `albumLikes:${albumId}`,
        JSON.stringify(mappedResult),
      );

      return {
        likesCount: mappedResult,
        src: 'database',
      };
    }
  }

  async deleteAlbumLikes(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 and user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Anda belum pernah melakukan like pada album ini',
      );
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async findAlbum(albumId) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async findAlbumLikes(albumId, userId) {
    const query = {
      text: 'SELECT id FROM user_album_likes where user_id = $1 and album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError(
        'Anda sudah pernah melakukan like pada album ini',
      );
    }
  }
}

module.exports = AlbumService;
