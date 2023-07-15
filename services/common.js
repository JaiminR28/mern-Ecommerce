exports.isAuth = (req, res, done) => {
  if (req.user) {
    done();
  } else {
    res.send(401);
  }
};

exports.sanitizeUser = (user) => ({ id: user.id, role: user.role });
