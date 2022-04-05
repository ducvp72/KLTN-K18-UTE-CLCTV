const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const groupSchema = mongoose.Schema(
  {
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
    member: {
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
groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
