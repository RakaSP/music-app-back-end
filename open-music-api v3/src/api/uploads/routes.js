const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{albumId}/covers',
    handler: (request, h) => handler.postUploadImageHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
    },
  },
  {
    method: 'GET',
    path: '/albums/{albumId}/covers/{filename}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file/images'),
      },
    },
  },
];

module.exports = routes;
