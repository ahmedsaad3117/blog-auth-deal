const CustomError = require('../errors');

const checkPermissions = (requestUser, authToUse) => {
  if (requestUser.role.toLocaleLowerCase() === authToUse.toLocaleLowerCase()) return ;
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route by your current role'
  );
};

module.exports = checkPermissions;