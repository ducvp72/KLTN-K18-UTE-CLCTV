const allRoles = {
  user: [' ', 'general'],
  admin: ['deleteAdmins', 'getUsers', 'manageUsers', 'general'],
  superadmin: ['getUsers', 'manageUsers', 'getAdmins', 'manageAdmins'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
