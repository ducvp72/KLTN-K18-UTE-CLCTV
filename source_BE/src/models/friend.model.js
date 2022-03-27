const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const friendSchema = mongoose.Schema(
  {
    friends: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],
    blackfriends: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },
    ],

    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
friendSchema.plugin(toJSON);
friendSchema.plugin(paginate);

/**
 * @typedef Friend
 */
const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
