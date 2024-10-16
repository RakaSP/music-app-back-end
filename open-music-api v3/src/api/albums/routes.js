const routes = (albumsHandler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => albumsHandler.postAlbumHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{albumId}',
    handler: (request, h) => albumsHandler.getAlbumByIdHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/albums/{albumId}',
    handler: (request, h) => albumsHandler.putAlbumByIdHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}',
    handler: (request, h) => albumsHandler.deleteAlbumByIdHandler(request, h),
  },
  {
    method: 'POST',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => albumsHandler.postAlbumLikesHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => albumsHandler.getAlbumLikesHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{albumId}/likes',
    handler: (request, h) => albumsHandler.deleteAlbumLikesHandler(request, h),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
