const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const waitingFriendSchema = mongoose.Schema(
  {
    waitingFriends: {
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
waitingFriendSchema.plugin(toJSON);
waitingFriendSchema.plugin(paginate);

/**
 * @typedef Friend
 */
const WaitingFriend = mongoose.model('WaitingFriend', waitingFriendSchema);

module.exports = WaitingFriend;
