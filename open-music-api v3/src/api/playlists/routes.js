const routes = (playlistsHandler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: (request, h) => playlistsHandler.postPlaylistHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: (request) => playlistsHandler.getPlaylistHandler(request),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: (request) => playlistsHandler.deletePlaylistByIdHandler(request),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: (request, h) => playlistsHandler.postPlaylistSongHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: (request, h) => playlistsHandler.getPlaylistSongsHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: (request) => playlistsHandler.deletePlaylistSongHandler(request),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/activities',
    handler: (request, h) => playlistsHandler.getPlaylistActivitiesHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
