const passport = require('passport');

exports.isAuth = (req, res) => passport.authenticate('jwt');

exports.sanitizeUser = (user) => ({ id: user.id, role: user.role });
