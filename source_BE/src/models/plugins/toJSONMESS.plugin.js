/* eslint-disable no-param-reassign */

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const deleteAtPath = (obj, path, index) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      // if (ret.sender) {
      // delete ret.sender.role;
      // delete ret.sender.isActivated;
      // delete ret.sender.gender;
      // delete ret.sender.email;
      // delete ret.sender.username;
      // delete ret.sender.isBanned;
      // delete ret.sender.birth;
      // delete ret.sender.subname;
      // delete ret.sender;
      // }
      // if (ret.user) {
      //   ret.user = ret.sender;
      //   ret.user._id = ret.sender.id;
      //   ret.user.name = ret.sender.fullname;
      //   delete ret.user.id;
      //   delete ret.user.fullname;
      // }

      if (ret.sender.id.toString().match(/^[0-9a-fA-F]{24}$/)) {
        delete ret.sender.check;
        delete ret.sender.role;
        delete ret.sender.isActivated;
        delete ret.sender.gender;
        delete ret.sender.email;
        delete ret.sender.username;
        delete ret.sender.isBanned;
        delete ret.sender.birth;
        delete ret.sender.subname;
        ret.sender.name = ret.sender.fullname;
        delete ret.sender.fullname;
        ret.sender._id = ret.sender.id;
        delete ret.sender.id;
        ret.user = ret.sender;
        delete ret.sender;
      }
      delete ret.groupId;
      delete ret.typeMessage;
      // delete ret.createdAt;
      // delete ret.updatedAt;

      //
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

module.exports = toJSON;
