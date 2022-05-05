const mongoose = require('mongoose');
const { toJSONG, paginate } = require('./plugins');

const userGroupSchema = mongoose.Schema(
  {
    groupId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Group',
      required: true,
    },
    member: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userGroupSchema.plugin(toJSONG);
userGroupSchema.plugin(paginate);

/**
 * @typedef Token
 */
const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;
