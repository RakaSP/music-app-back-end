const routes = (collaborationsHandler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => collaborationsHandler.postCollaborationHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => collaborationsHandler.deleteCollaborationHandler(request),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
