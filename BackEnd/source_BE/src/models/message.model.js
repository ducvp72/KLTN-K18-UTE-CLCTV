const mongoose = require('mongoose');
const { toJSONMESS, paginate, paginateMess, paginationLastMess } = require('./plugins');
const { fileTypes, files } = require('../config/fileTypes');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    typeMessage: {
      type: String,
      enum: files,
      required: true,
    },
    text: {
      type: String,
      default: 'null',
    },
    image: {
      type: String,
      default: 'null',
    },
    video: {
      type: String,
      default: 'null',
    },
    file: {
      type: String,
      default: 'null',
    },
    typeId: {
      type: String,
      default: 'null',
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.plugin(toJSONMESS);
messageSchema.plugin(paginate);
messageSchema.plugin(paginateMess);
messageSchema.plugin(paginationLastMess);

/**
 * @typedef Message
 */
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
