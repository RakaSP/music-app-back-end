const { CollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validationResults = CollaborationPayloadSchema.validate(payload);
    if (validationResults.error) {
      throw new InvariantError(validationResults.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
