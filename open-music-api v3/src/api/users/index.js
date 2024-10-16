const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { userService, userValidator }) => {
    const usersHandler = new UsersHandler(userService, userValidator);
    server.route(routes(usersHandler));
  },
};
