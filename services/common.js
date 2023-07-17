const passport = require('passport');

exports.isAuth = (req, res) => passport.authenticate('jwt');

exports.sanitizeUser = (user) => ({ id: user.id, role: user.role });

exports.SECRET_KEY = 'SECRET_KEY';

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }

  // TODO : this is temporary token for testing
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjRlMDc5OWU0NTU5Nzk2YWNhZGY3YyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5NTc1NTQ1fQ.1sL1wX9o2z50GxbjurLnSaUdW32ABKS_IUfVyF97Z0g';
  return token;
};
