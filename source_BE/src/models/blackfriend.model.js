const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const blackFriendSchema = mongoose.Schema(
  {
    blackFriends: [
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
blackFriendSchema.plugin(toJSON);
blackFriendSchema.plugin(paginate);

/**
 * @typedef BlackFriend
 */
const BlackFriend = mongoose.model('BlackFriend', blackFriendSchema);

module.exports = BlackFriend;
