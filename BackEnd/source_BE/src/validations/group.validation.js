const Joi = require('joi');
const { objectId, objectIdArr } = require('./custom.validation');

const waitingMember = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const member = {
  body: Joi.object().keys({
    memberId: Joi.array().custom(objectIdArr).required(),
  }),
};

const addMember = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
    memberId: Joi.array().custom(objectIdArr).required(),
  }),
};

const deleteGroup = {
  body: Joi.object().keys({
    groupId: Joi.array().custom(objectIdArr).required(),
  }),
};

const createGroup = {
  body: Joi.object().keys({
    // groupName: Joi.string().required().min(5).max(100),
    memberId: Joi.array().custom(objectIdArr),
  }),
};

const changeNameGroup = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
    groupName: Joi.string().required().min(5).max(100),
  }),
};

const deleteNameGroup = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const groupMember = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const getGroupByID = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const getListGroup = {
  query: Joi.object().keys({
    key: Joi.string().allow(null).allow(''),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string(),
  }),
};

const getGroupToJoin = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
  }),
};

const getGroupPrivate = {
  body: Joi.object().keys({
    friendId: Joi.string().custom(objectId).required(),
    userId: Joi.string().custom(objectId).required(),
  }),
};

const getUserToAdd = {
  query: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
    key: Joi.string().allow(null).allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getListWaiting = {
  query: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
    key: Joi.string().allow(null).allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  getListWaiting,
  createGroup,
  getUserToAdd,
  member,
  addMember,
  waitingMember,
  getGroupByID,
  groupMember,
  getListGroup,
  changeNameGroup,
  deleteNameGroup,
  getGroupToJoin,
  deleteGroup,
  getGroupPrivate,
};
