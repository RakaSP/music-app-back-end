const {
  PlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResults = PlaylistPayloadSchema.validate(payload);
    if (validationResults.error) {
      throw new InvariantError(validationResults.error.message);
    }
  },
  validateSongToPlaylistPayload: (payload) => {
    const validationResults = PostSongToPlaylistPayloadSchema.validate(payload);
    if (validationResults.error) {
      throw new InvariantError(validationResults.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
