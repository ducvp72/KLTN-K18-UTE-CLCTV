const httpStatus = require('http-status');
const { User, Search, Friend, WaitingFriend, Group, UserGroup } = require('../models');
const ApiError = require('../utils/ApiError');

const changeName = require('../utils/sort');

const { userService } = require('../services');

const getGroupById = async (adminId, groupId) => {
  const find = await Group.findOne({ admin: adminId, _id: groupId });
  if (!find) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find Group Or You not admin group');
  }
  return find;
};

const getGroupInfo = async (groupId) => {
  const find = await Group.findById(groupId);
  const countMem = await UserGroup.find({ groupId });
  if (!find) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find Group');
  }
  const objGroup = find.toObject();
  objGroup.countMember = countMem.length;
  delete objGroup.__v;

  console.log('aaa', objGroup);
  return objGroup;
};

const findFirstGroup = async (adminId, memberId) => {
  const find = UserGroup.findOne({ admin: adminId, member: memberId });
  return find;
};

const createChat = async (admin, memberId) => {
  const memberN = await userService.getUserById(memberId);
  if (!memberN) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find User');
  }
  if (await findFirstGroup(admin.id, memberId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You have aleady create personal chat with each other');
  }
  const chat = await Group.create({
    subName: await changeName(memberN.fullname),
    groupName: memberN.fullname,
    admin: admin.id,
    groupType: 'personal',
  });
  await UserGroup.create({
    groupId: chat.id,
    member: memberId,
    admin: admin.id,
  });
  return chat;
};

const isChangeName = async (groupId) => {
  const find = await Group.findById(groupId);
  console.log('findName', find);
  return find;
};

const changeNameGroup = async (admin, groupR) => {
  const checkG = await getGroupById(admin.id, groupR.groupId);
  let groupN;
  if (checkG.groupType === 'public' && JSON.stringify(checkG.admin) !== `"${admin.id}"`) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Only Admin can change name of group');
  }
  await Group.findByIdAndUpdate(
    groupR.groupId,
    {
      subName: await changeName(groupR.groupName),
      groupName: groupR.groupName,
      isChangeName: true,
    },
    { new: true, useFindModify: false }
  )
    .then((updateGroup) => {
      groupN = updateGroup;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  return groupN;
};

const addMember = async (user, groupR) => {
  console.log('groupR', groupR);
  if (!isChangeName(groupR.groupId).isChangeName) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You need change name of group because member >=2');
  }
  // for (let i=0; i < groupR.member)
  // const data = Group.insertMany();
};

const createGroup = async (user) => {};

const getGroup = async (req, res) => {};

const checkMember = async (req, res) => {};

const deleteGroup = async (req, res) => {};

const searchMember = async (req, res) => {};

const deleteMember = async (req, res) => {};

const setAdminGroup = async (req, res) => {};

const joinGroup = async (req, res) => {};

const leaveGroup = async (req, res) => {};

const acceptRequest = async (req, res) => {};

const cancleRequest = async (req, res) => {};

module.exports = {
  createChat,
  checkMember,
  getGroupById,
  getGroup,
  searchMember,
  createGroup,
  changeNameGroup,
  deleteGroup,
  addMember,
  deleteMember,
  setAdminGroup,
  joinGroup,
  leaveGroup,
  acceptRequest,
  cancleRequest,
  getGroupInfo,
};
