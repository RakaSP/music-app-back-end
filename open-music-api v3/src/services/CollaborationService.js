const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class CollaborationService {
  constructor() {
    this._pool = new Pool();
  }

  async addCollaboration(playlistId, userId, owner) {
    await this.findUser(userId);
    await this.findPlaylist(playlistId);
    if (owner === userId) {
      throw new InvariantError(
        'Tidak bisa melakukan collab dengan diri sendiri',
      );
    }

    const collaborationId = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id',
      values: [collaborationId, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan collaboration');
    }

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapkan collaboration');
    }
  }

  async findUser(userId) {
    const query = {
      text: 'SELECT * FROM users where id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async findPlaylist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationService;
