const Joi = require('joi');
const { objectId, objectIdArr } = require('./custom.validation');

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

const changeNameGroup = {
  body: Joi.object().keys({
    groupId: Joi.string().custom(objectId).required(),
    groupName: Joi.string().required().min(5).max(50),
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
    type: Joi.string().valid('white', 'black'),
    sortBy: Joi.string(),
    populate: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  member,
  addMember,
  getGroupByID,
  groupMember,
  getListGroup,
  changeNameGroup,
};
