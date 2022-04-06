const mongoose = require('mongoose');
const { toJSONG, paginate } = require('./plugins');

const groupSchema = mongoose.Schema(
  {
    subName: {
      type: String,
      required: true,
    },
    isChangeName: {
      type: Boolean,
      required: true,
      default: false,
    },
    groupName: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    groupType: {
      type: String,
      required: true,
      enum: ['personal', 'pubic'],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupSchema.plugin(toJSONG);
groupSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
