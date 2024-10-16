const routes = (songsHandler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => songsHandler.postSongHandler(request, h),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request) => songsHandler.getSongsHandler(request),
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: (request) => songsHandler.getSongByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: (request) => songsHandler.putSongByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: (request) => songsHandler.deleteSongByIdHandler(request),
  },
];
module.exports = routes;
