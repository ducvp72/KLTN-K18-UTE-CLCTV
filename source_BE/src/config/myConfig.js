const tokenTypes = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  RESET_PASSWORD: 'resetPassword',
};

const genderTypes = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
};

const roleTypes = {
  USER: 'user',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

const registerTypes = {
  EMAIL: 'email',
  MOBILE: 'mobile',
};

const fileTypes = {
  IMAGE: 'IMAGE',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO',
  TEXT: 'TEXT',
  RECALL: 'RECALL',
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  DOWNLOAD: 'DOWNLOAD',
};

module.exports = {
  tokenTypes,
  genderTypes,
  roleTypes,
  registerTypes,
  fileTypes,
};
