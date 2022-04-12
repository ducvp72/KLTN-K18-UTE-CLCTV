const httpStatus = require('http-status');
const moment = require('moment');
const { User, Search, Friend, WaitingFriend, Group, UserGroup, WaitingGroup } = require('../models');
const ApiError = require('../utils/ApiError');

const changeName = require('../utils/sort');
const { userService, friendService } = require('../services');

const checkMember = async (groupR) => {
  console.log(groupR);
  const checkMem = await UserGroup.findOne({ groupId: groupR.groupId, member: groupR.userId }).populate([
    { path: 'groupId', model: 'Group', select: 'groupName subName groupType' },
    { path: 'member', model: 'User', select: 'avatar fullname username ' },
    { path: 'admin', model: 'User', select: 'avatar fullname username ' },
  ]);

  return checkMem;
};

const autoUpdateNameGroup = async (groupId, userId) => {
  let group;
  const findMembers = await UserGroup.find({ groupId, member: { $nin: userId } }).populate('member');
  // eslint-disable-next-line prefer-const
  let nameMember = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < findMembers.length; i++) {
    nameMember.push(findMembers[i].member.fullname);
  }
  console.log(nameMember);
  const groupName = nameMember.reduce((prev, curr) => {
    // eslint-disable-next-line prefer-template
    return `${prev}, ` + curr;
  });
  console.log(groupName.trim());
  const subName = await changeName(groupName);
  await Group.findByIdAndUpdate(
    groupId,
    {
      groupName,
      subName,
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((res) => {
      console.log('New', res);
      group = res;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  return group;
};

const getGroupById = async (adminId, groupId) => {
  const find = await Group.findOne({ admin: adminId, _id: groupId }).populate({
    path: 'admin',
    select: 'fullname username avatar gender birth -_id',
  });
  if (!find) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find Group Or You not admin group');
  }
  return find;
};

const getGroupInfo = async (groupId) => {
  console.log('ok ddd');
  const find = await Group.findById(groupId).populate({
    path: 'admin',
    select: 'fullname username avatar gender birth -_id',
  });
  const countMem = await UserGroup.find({ groupId });
  if (!find) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Can not find Group');
  }
  const objGroup = find.toObject();
  objGroup.countMember = countMem.length;
  delete objGroup.__v;
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

  await UserGroup.create({
    groupId: chat.id,
    member: admin.id,
    admin: admin.id,
  });

  return chat;
};

const deleteNameGroup = async (user, groupR) => {
  const group = await Group.findById(groupR.groupId);

  if (group.groupType === 'public' && JSON.stringify(group.admin) !== `"${user.id}"`) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Only Admin can delete name of group');
  }
  let groupName = '';
  if (group.isChangeName === true) {
    const userM = await UserGroup.find({ groupId: groupR.groupId }).populate('member');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userM.length; i++) {
      if (userM[i].member.fullname === user.fullname) {
        // eslint-disable-next-line no-continue
        continue;
      }
      groupName += `${userM[i].member.fullname}, `;
    }
    groupName = groupName.trim().slice(0, -1);
    const subName = await changeName(groupName);
    await Group.findByIdAndUpdate(groupR.groupId, { groupName, subName, isChangeName: false });
  }
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

const getUserToAdd = async (userR, filter, options) => {
  const checkIn = await UserGroup.find({ groupId: filter.groupId });
  const members = checkIn.map((m) => m.member);
  const users = await Search.paginateUserGroup(members, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  // totalResults = totalResults - 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of users.results) {
    const newUser = {};
    const userId = item.user.id;
    // eslint-disable-next-line prefer-destructuring
    const username = item.username;
    // eslint-disable-next-line prefer-destructuring
    const fullname = item.user.fullname;
    // eslint-disable-next-line prefer-destructuring
    const email = item.user.email;
    // eslint-disable-next-line prefer-destructuring
    const avatar = item.user.avatar;
    // eslint-disable-next-line no-await-in-loop
    const isFriend = await friendService.isFriend(userR.id, userId);
    // console.log(isFriend);
    results.push(Object.assign(newUser, { userId, fullname, username, avatar, email, isFriend }));
  }
  return { results, page, limit, totalPages, totalResults };
};

const isInGroup = async (member, groupId) => {
  // console.log('Member', member);
  // console.log('groupId', groupId);
  const check = await UserGroup.findOne({ member, groupId }).populate('member');
  return check;
};

const addMember = async (user, groupR) => {
  console.log('groupR', groupR);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < groupR.memberId.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const find = await isInGroup(groupR.memberId[i], groupR.groupId);
    if (find) {
      throw new ApiError(httpStatus.BAD_REQUEST, `${find.member.fullname} is in this group`);
      // eslint-disable-next-line no-unreachable
    }
  }

  // eslint-disable-next-line prefer-const
  let arrUser = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < groupR.memberId.length; i++) {
    const item = { member: groupR.memberId[i], admin: user.id, groupId: groupR.groupId };
    arrUser.push(item);
  }

  //Them user vao group
  await UserGroup.insertMany(arrUser);

  //Kiem tra isChangeName
  let groupName = '';

  const group = await Group.findById(groupR.groupId);
  if (group.isChangeName === false) {
    const userM = await UserGroup.find({ groupId: groupR.groupId }).populate('member');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userM.length; i++) {
      if (userM[i].member.fullname === user.fullname) {
        // eslint-disable-next-line no-continue
        continue;
      }
      groupName += `${userM[i].member.fullname}, `;
    }
    groupName = groupName.trim().slice(0, -1);
    const subName = await changeName(groupName);
    if (userM.length > 2) {
      console.log(userM.length);
      await Group.findByIdAndUpdate(groupR.groupId, { groupName, subName, groupType: 'public' });
    } else await Group.findByIdAndUpdate(groupR.groupId, { groupName, subName, groupType: 'personal' });
  }
};

const createGroup = async (user, groupR) => {
  groupR.memberId.push(user.id);
  console.log(groupR);
  let group;
  // if (!groupR) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Please add your group name !');
  // }

  await Group.create({
    isChangeName: false,
    groupName: 'df',
    subName: 'df',
    admin: user.id,
    groupType: 'public',
  })
    .then(async (res) => {
      // group = res;
      // eslint-disable-next-line no-plusplus
      if (groupR.memberId && groupR.memberId.length > 0) {
        // eslint-disable-next-line prefer-const
        let arrUser = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < groupR.memberId.length; i++) {
          const item = { member: groupR.memberId[i], admin: user.id, groupId: res.id };
          arrUser.push(item);
        }
        //Them user vao group
        await UserGroup.insertMany(arrUser);
        group = await autoUpdateNameGroup(res._id, user.id);
      }
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  return group;
};

const leaveGroup = async (user, groupR) => {
  const group = await Group.findById(groupR.groupId);
  await UserGroup.deleteOne({ groupId: groupR.groupId, member: user.id });
  if (group.isChangeName === false) {
    let groupName = '';
    const userM = await UserGroup.find({ groupId: groupR.groupId }).populate('member');
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < userM.length; i++) {
      if (userM[i].member.fullname === user.fullname) {
        // eslint-disable-next-line no-continue
        continue;
      }
      groupName += `${userM[i].member.fullname}, `;
    }
    groupName = groupName.trim().slice(0, -1);
    const subName = await changeName(groupName);
    if (userM.length > 2) {
      await Group.findByIdAndUpdate(groupR.groupId, { groupName, subName, groupType: 'public' });
    } else await Group.findByIdAndUpdate(groupR.groupId, { groupName, subName, groupType: 'personal' });
  }
};

const deleteMember = async (user, GroupR) => {
  const group = await Group.findById(GroupR.groupId);
  if (JSON.stringify(group.admin) !== `"${user.id}"`) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You must be admin of group !');
  }
  await UserGroup.deleteMany({ member: GroupR.memberId });
  if (group.isChangeName === false) {
    await autoUpdateNameGroup(GroupR.groupId, user.id);
  }
};

const checkAdminGroup = async (adminId, groupId) => {
  const find = await Group.findOne({ admin: adminId, _id: groupId });
  if (!find) {
    throw new ApiError(httpStatus.NOT_FOUND, 'You are not admin group');
  }
};

const setAdminGroup = async (user, groupR) => {
  await checkAdminGroup(user.id, groupR.groupId);
  await Group.findByIdAndUpdate(
    groupR.groupId,
    {
      admin: groupR.userId,
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then(async (res) => {
      const options = { multi: true, upsert: true };
      // eslint-disable-next-line no-unused-expressions
      await UserGroup.updateMany(
        {
          groupId: groupR.groupId,
        },
        { admin: groupR.userId },
        options
      );
      if (groupR.groupId === false) {
        await autoUpdateNameGroup(groupR.groupId, groupR.userId);
      }
      console.log(res);
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
};

const joinGroup = async (user, groupR) => {
  const value = { groupId: groupR.groupId, userId: user.id };
  if (await checkMember(value)) {
    throw new ApiError(httpStatus.BAD_GATEWAY, 'You was in group');
  }
  try {
    await WaitingGroup.create({
      member: user.id,
      groupId: groupR.groupId,
    });
  } catch (err) {
    console.log(err);
  }
};

const acceptRequest = async (user, groupR) => {
  await checkAdminGroup(user.id, groupR.groupId);
  console.log('arr', groupR);
  try {
    await addMember(user, groupR);
    await WaitingGroup.deleteMany({
      groupId: groupR.groupId,
      member: { $in: groupR.memberId },
    });
    // autoUpdateNameGroup(groupR.groupId, user.id);
  } catch (err) {
    console.log(err);
  }
};

const cancleRequest = async (user, groupR) => {
  await checkAdminGroup(user.id, groupR.groupId);
  try {
    await WaitingGroup.deleteMany({
      groupId: groupR.groupId,
      member: { $in: groupR.memberId },
    });
  } catch (err) {
    console.log(err);
  }
};

const getMyGroup = async (user, filter, options) => {
  console.log(filter, options, user.id);
  // const find = await UserGroup.find({ member: user.id }).populate([
  //   { path: 'groupId', model: 'Group', select: 'isChangeName subName groupName groupType' },
  //   { path: 'admin', model: 'User', select: 'avatar birth fullname username email gender' },
  // ]);
  const find = await UserGroup.find({ member: user.id });
  const myGroup = find.map((item) => item.groupId);
  const rs = await Group.paginateGroup(myGroup, filter, options);
  return rs;
};

const deleteGroup = async (user, groupR) => {
  const find = await Group.find({ admin: user.id, _id: { $in: groupR.groupId } }).populate('admin');
  // const checkMem = await UserGroup.find({ member: user.id, groupId: { $in: groupR.groupId } });
  // console.log('find', find);
  // console.log('checkMem', checkMem);

  if (find.length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are admin in one or more group please set admin for another member before leave group!'
    );
  }
  try {
    await UserGroup.deleteMany({ member: user.id, groupId: { $in: groupR.groupId } });
    const groupS = await Group.find({ _id: { $in: groupR.groupId } });
    console.log('groups', groupS);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < groupS.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      // console.log('groups', groupS[i]._id);
      // console.log('admin', groupS[i].admin);
      // eslint-disable-next-line no-await-in-loop
      if (groupS[i].isChangeName === false) {
        // eslint-disable-next-line no-await-in-loop
        await autoUpdateNameGroup(groupS[i]._id, groupS[i].admin);
      }
    }
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

const searchMember = async (userR, filter, options) => {
  const checkIn = await UserGroup.find({ groupId: filter.groupId, member: { $nin: userR.id } });
  const members = checkIn.map((m) => m.member);
  const users = await Search.paginateMember(members, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  // totalResults = totalResults - 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of users.results) {
    const newUser = {};
    const userId = item.user.id;
    // eslint-disable-next-line prefer-destructuring
    const username = item.username;
    // eslint-disable-next-line prefer-destructuring
    const fullname = item.user.fullname;
    // eslint-disable-next-line prefer-destructuring
    const email = item.user.email;
    // eslint-disable-next-line prefer-destructuring
    const avatar = item.user.avatar;
    // eslint-disable-next-line no-await-in-loop
    const isFriend = await friendService.isFriend(userR.id, userId);
    // console.log(isFriend);
    results.push(Object.assign(newUser, { userId, fullname, username, avatar, email, isFriend }));
  }
  return { results, page, limit, totalPages, totalResults };
};

const getListToAccept = async (userR, filter, options) => {
  const checkIn = await WaitingGroup.find({ groupId: filter.groupId });
  const members = checkIn.map((m) => m.waitingMembers);
  const users = await Search.paginateWaitingGroup(members, filter, options);
  const results = [];
  const { page, limit, totalPages, totalResults } = users;
  // eslint-disable-next-line no-restricted-syntax
  // totalResults = totalResults - 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const item of users.results) {
    const newUser = {};
    const userId = item.user.id;
    // eslint-disable-next-line prefer-destructuring
    const username = item.username;
    // eslint-disable-next-line prefer-destructuring
    const fullname = item.user.fullname;
    // eslint-disable-next-line prefer-destructuring
    const email = item.user.email;
    // eslint-disable-next-line prefer-destructuring
    const avatar = item.user.avatar;
    // eslint-disable-next-line no-await-in-loop
    const isFriend = await friendService.isFriend(userR.id, userId);
    // console.log(isFriend);
    results.push(Object.assign(newUser, { userId, fullname, username, avatar, email, isFriend }));
  }
  return { results, page, limit, totalPages, totalResults };
};

const getGroupLink = async (memberId, groupId) => {
  console.log('memberId', memberId);
  console.log('groupId', groupId);
  let check = 0;
  let objGroup;
  await UserGroup.findOne({ member: memberId, groupId })
    .then(async (res) => {
      const find = await WaitingGroup.findOne({ groupId, member: memberId });
      console.log('find', res);
      if (find) {
        //Waiting to join group
        check = 2;
      }
      if (res) {
        //was in  group
        check = 1;
      }
      const groupInfo = await Group.findById(groupId).populate({
        path: 'admin',
        select: 'fullname username avatar gender birth -_id',
      });
      const countMem = await UserGroup.find({ groupId });
      objGroup = groupInfo.toObject();
      objGroup.countMember = countMem.length;
      objGroup.isInGroup = check;
      objGroup.createdAt = moment(objGroup.createdAt).format('DD/MM/YYYY');
      delete objGroup.__v;
      delete objGroup.updatedAt;
    })
    .catch((err) => {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err);
    });
  return objGroup;
};

module.exports = {
  createChat,
  checkMember,
  getUserToAdd,
  getGroupById,
  getMyGroup,
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
  deleteNameGroup,
  getListToAccept,
  getGroupLink,
};
