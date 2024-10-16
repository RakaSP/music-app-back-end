const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
