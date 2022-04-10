const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const waitingGroupSchema = mongoose.Schema(
  {
    waitingMembers: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    groupId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Group', required: true },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
waitingGroupSchema.plugin(toJSON);
waitingGroupSchema.plugin(paginate);

/**
 * @typedef Member
 */
const WaitingGroup = mongoose.model('WaitingGroup', waitingGroupSchema);

module.exports = WaitingGroup;
