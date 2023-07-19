const passport = require('passport');

exports.isAuth = (req, res) => passport.authenticate('jwt');

exports.sanitizeUser = (user) => ({ id: user.id, role: user.role });

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  // TODO : this is temporary token for testing
  // token =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjdmN2VmMjk5ODYwOGM0MjNlMWE0NyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5Nzc4MTYwfQ.pbJfjjbwwtmFnmzBlbUKFWgCmOkmACX8M3-wbfQZIkY';
  return token;
};
