const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { playlistService, playlistValidator }) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistService,
      playlistValidator,
    );
    server.route(routes(playlistsHandler));
  },
};
