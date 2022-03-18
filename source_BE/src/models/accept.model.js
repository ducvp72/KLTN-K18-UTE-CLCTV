const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const acceptSchema = mongoose.Schema(
  {
    friends: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },

    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
acceptSchema.plugin(toJSON);
acceptSchema.plugin(paginate);

/**
 * @typedef Accept
 */
const Accept = mongoose.model('Accept', acceptSchema);

module.exports = Accept;
