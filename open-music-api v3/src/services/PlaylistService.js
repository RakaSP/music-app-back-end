const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const playlistId = `pl-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
      values: [playlistId, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal menambahkan playlist');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM
                playlists
              INNER JOIN users ON playlists.owner = users.id
              LEFT JOIN collaborations ON playlists.id = collaborations.playlist_id
              WHERE
                playlists.owner = $1 OR collaborations.user_id = $1
              `,
      values: [owner],
    };
    const result = await this._pool.query(query);

    const playlistsData = result.rows;

    return playlistsData;
  }

  async deletePlaylist(playlistId) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError(
        'Playlist gagal dihapus. Playlist Id tidak ditemukan',
      );
    }
  }

  async addSongToPlaylist(playlistId, songId, userId) {
    await this.findSong(songId);
    const playlistSongsId = `pls-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [playlistSongsId, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    await this.addPlaylistActivities(playlistId, songId, userId, 'add');

    return result.rows[0].id;
  }

  async getPlaylistDetail(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              INNER JOIN users ON playlists.owner = users.id
              WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
              FROM playlist_songs
              INNER JOIN songs ON playlist_songs.song_id = songs.id
              WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongFromPlaylist(playlistId, songId, userId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu pada Playlist tidak ditemukan');
    }
    await this.addPlaylistActivities(playlistId, songId, userId, 'delete');
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT
              playlist_song_activities.id,
              songs.title,
              songs.performer,
              users.username,
              playlist_song_activities.action,
              playlist_song_activities.time
            FROM
              playlist_song_activities
              INNER JOIN songs ON playlist_song_activities.song_id = songs.id
              INNER JOIN users ON playlist_song_activities.user_id = users.id
            WHERE
              playlist_song_activities.playlist_id = $1
            ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist song activities tidak ditemukan');
    }
    return result.rows;
  }

  async addPlaylistActivities(playlistId, songId, userId, action) {
    const playlistActivitiesId = `pla-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [playlistActivitiesId, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist Song Activities gagal ditambahkan');
    }
  }

  async findSong(songId) {
    const query = {
      text: 'SELECT * FROM songs where id = $1',
      values: [songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses playlist ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } else {
        throw error;
      }
    }
  }
}

module.exports = PlaylistService;
