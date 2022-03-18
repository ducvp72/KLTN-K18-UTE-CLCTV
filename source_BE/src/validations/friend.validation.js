const Joi = require('joi');
const { objectId } = require('./custom.validation');

const friend = {
  body: Joi.object().keys({
    friendId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  friend,
};
