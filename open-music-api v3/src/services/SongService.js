const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelSong } = require('../utils/songs');
const { mapDBToModelSongById } = require('../utils/songs/songById');

const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, performer, genre, duration, albumId,
  }) {
    const songId = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [songId, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getSongs(titleParam, performerParam) {
    let query = 'SELECT id as song_id, * FROM songs';

    if (titleParam && performerParam) {
      query += ` WHERE title ILIKE '%${titleParam}%' AND performer ILIKE '%${performerParam}%'`;
    } else if (titleParam) {
      query += ` WHERE title ILIKE '%${titleParam}%'`;
    } else if (performerParam) {
      query += ` WHERE performer ILIKE '%${performerParam}%'`;
    }

    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSong);
  }

  async getSongById(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return mapDBToModelSongById(result.rows[0]);
  }

  async editSongById(
    songId,
    {
      title, year, performer, genre, duration, albumId,
    },
  ) {
    const query = {
      text: `UPDATE songs SET title = $1, year = $2, performer = $3,
       genre = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id`,
      values: [title, year, performer, genre, duration, albumId, songId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(songId) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Catatan gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
