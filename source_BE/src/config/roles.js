const allRoles = {
  user: [' '],
  admin: ['deleteAdmins', 'getUsers', 'manageUsers'],
  superadmin: ['getUsers', 'manageUsers', 'getAdmins', 'manageAdmins'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
