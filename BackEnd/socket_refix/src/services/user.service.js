const { User, UserGroup } = require("../models");

const getUserById = async (userId) => {
  const rs = await User.findById(userId);
  if (!rs) {
    return;
  }
  return rs;
};

const checkInGroupDB = async (member, groupId) => {
  const rs = await UserGroup.findOne({ member, groupId }).populate("member");
  return rs;
};

module.exports = { getUserById, checkInGroupDB };
