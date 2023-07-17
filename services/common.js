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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjRkMTVmMDFmNzhhZTQ1YzRhMGRjYyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5NTcxNjc5fQ.FiX3Hrh5fWYDOKlhDpq26XOKVRsBBaWusMTKP38ngSo';
  return token;
};
