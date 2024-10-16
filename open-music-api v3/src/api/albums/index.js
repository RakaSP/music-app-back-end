const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumService, albumValidator }) => {
    const albumsHandler = new AlbumsHandler(albumService, albumValidator);
    server.route(routes(albumsHandler));
  },
};
