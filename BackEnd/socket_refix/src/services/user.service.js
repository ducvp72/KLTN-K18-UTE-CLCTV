const { User } = require("../models");

const getUserById = async (userId) => {
  const rs = await User.findById(userId);
  if (!rs) {
    console.log("Make sure right Id");
    return;
  }
  return rs;
};

module.exports = { getUserById };
