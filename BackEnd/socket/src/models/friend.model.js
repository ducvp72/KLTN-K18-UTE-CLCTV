const mongoose = require('mongoose');
const { toJSONF, paginate } = require('./plugins');

const friendSchema = mongoose.Schema(
  {
    friends: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    isBlocked: { required: true, type: Boolean, default: false },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
friendSchema.plugin(toJSONF);
friendSchema.plugin(paginate);

/**
 * @typedef Friend
 */
const Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;
