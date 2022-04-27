const mongoose = require('mongoose');
const { toJSONG, paginateGroup, paginateLast } = require('./plugins');

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
    last: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Message',
      // required: true,
    },
    groupType: {
      type: String,
      required: true,
      enum: ['personal', 'public'],
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
groupSchema.plugin(toJSONG);
groupSchema.plugin(paginateGroup);
groupSchema.plugin(paginateLast);

/**
 * @typedef Token
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
