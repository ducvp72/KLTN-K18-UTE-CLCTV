const Joi = require('joi');
const { objectId, objectIdArr } = require('./custom.validation');

const sendText = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
    text: Joi.string().required(),
    typeId: Joi.string().required(),
  }),
};

const getFileById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const groupId = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const getFile = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    w: Joi.number().integer(),
    h: Joi.number().integer(),
  }),
};
const getMessagesFromConversation = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    owner: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    populate: Joi.string(),
    typeMessage: Joi.string().valid('DOWNLOAD', 'VIDEO', 'AUDIO', 'IMAGE', 'MEDIA'),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getListLast = {
  query: Joi.object().keys({
    key: Joi.string().allow(null).allow(''),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

module.exports = { groupId, sendText, getFileById, getFile, getMessagesFromConversation, getListLast };
