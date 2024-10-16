require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// album
const albumApi = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const AlbumValidator = require('./validator/albums');

// song
const songApi = require('./api/songs');
const SongService = require('./services/SongService');
const SongValidator = require('./validator/songs');

// user
const userApi = require('./api/users');
const UserService = require('./services/UserService');
const UserValidator = require('./validator/users');

// authentication
const authenticationApi = require('./api/authentications');
const AuthenticationService = require('./services/AuthenticationService');
const AuthenticationValidator = require('./validator/authentications');
const TokenManager = require('./tokenize/TokenManager');

// playlists
const playlistApi = require('./api/playlists');
const PlaylistService = require('./services/PlaylistService');
const PlaylistValidator = require('./validator/playlists');

// Collaborations
const collaborationApi = require('./api/collaborations');
const CollaborationService = require('./services/CollaborationService');
const CollaborationValidator = require('./validator/collaborations');

// Exports
const exportApi = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');

// Uploads
const uploadApi = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/uploads');

// Cache
const CacheService = require('./services/redis/CacheService');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const songService = new SongService();
  const userService = new UserService();
  const authenticationService = new AuthenticationService();
  const collaborationService = new CollaborationService();
  const playlistService = new PlaylistService(collaborationService);
  const storageService = new StorageService(
    path.resolve(__dirname, 'api/uploads/file/images'),
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('musicsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albumApi,
      options: {
        albumService,
        albumValidator: AlbumValidator,
      },
    },
    {
      plugin: songApi,
      options: {
        songService,
        songValidator: SongValidator,
      },
    },
    {
      plugin: userApi,
      options: {
        userService,
        userValidator: UserValidator,
      },
    },
    {
      plugin: authenticationApi,
      options: {
        authenticationService,
        userService,
        tokenManager: TokenManager,
        authenticationValidator: AuthenticationValidator,
      },
    },
    {
      plugin: playlistApi,
      options: {
        playlistService,
        playlistValidator: PlaylistValidator,
      },
    },
    {
      plugin: collaborationApi,
      options: {
        collaborationService,
        playlistService,
        collaborationValidator: CollaborationValidator,
      },
    },
    {
      plugin: exportApi,
      options: {
        producerService: ProducerService,
        playlistService,
        validator: ExportValidator,
      },
    },
    {
      plugin: uploadApi,
      options: {
        storageService,
        albumService,
        validator: UploadValidator,
      },
    },
  ]);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
