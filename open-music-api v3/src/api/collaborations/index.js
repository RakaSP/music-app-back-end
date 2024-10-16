const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (
    server,
    { collaborationService, playlistService, collaborationValidator },
  ) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationService,
      playlistService,
      collaborationValidator,
    );
    server.route(routes(collaborationsHandler));
  },
};
