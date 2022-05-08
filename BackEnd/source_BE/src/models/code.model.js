const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const codeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      // required: true,
    },
    group: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Group',
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
codeSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
