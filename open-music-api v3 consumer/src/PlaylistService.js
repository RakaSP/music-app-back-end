const { Pool } = require('pg');

const mapDBToModelPlaylist = (rows) => {
  if (rows.length === 0) {
    return null;
  }

  const playlist = {
    id: rows[0].id,
    name: rows[0].name,
    songs: [],
  };

  rows.forEach((row) => {
    const song = {
      id: row.song_id,
      title: row.title,
      performer: row.performer,
    };
    playlist.songs.push(song);
  });

  const data = {
    playlist,
  };
  return data;
};

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    const query = {
      text: `
        SELECT playlists.id, playlists.name, 
               songs.id AS song_id, songs.title, songs.performer
        FROM playlists
        INNER JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        INNER JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return mapDBToModelPlaylist(result.rows);
  }
}

module.exports = PlaylistService;
