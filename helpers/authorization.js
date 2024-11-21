const checkRole = (user, allowedRoles) => {
  if (!user) {
    throw new Error('Unauthorized: No user logged in');
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Unauthorized: Requires one of roles [${allowedRoles.join(', ')}]`);
  }
};

module.exports = { checkRole };
