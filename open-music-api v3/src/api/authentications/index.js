const AuthenticationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (
    server,
    {
      authenticationService,
      userService,
      tokenManager,
      authenticationValidator,
    },
  ) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationService,
      userService,
      tokenManager,
      authenticationValidator,
    );
    server.route(routes(authenticationsHandler));
  },
};
