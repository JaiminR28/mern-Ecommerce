const crypto = require('crypto');
const { Users } = require('../models/User');
const { sanitizeUser } = require('../services/common');

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async (err, hashedPassword) => {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const user = new Users({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        if (doc) {
          res.status(201).json(sanitizeUser(doc));
        }
      }
    );
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  res.json(req.user);
};
exports.checkUser = async (req, res) => {
  res.json(req.user);
};
