const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const { Schema } = mongoose;

const imageSchema = mongoose.Schema(
  {
    friends: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    imageTypes: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },

  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
imageSchema.plugin(toJSON);
imageSchema.plugin(paginate);

/**
 * @typedef Image
 */
const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
