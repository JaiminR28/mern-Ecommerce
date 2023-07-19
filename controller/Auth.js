// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Users } = require('../models/User');
const { sanitizeUser } = require('../services/common');

const SECRET_KEY = 'SECRET_KEY'; // TODO: replace this secret key

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
      async (error, hashedPassword) => {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const user = new Users({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to the session
          if (err) res.status(400).json(err);
          else {
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
            res
              .cookie('jwt', token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
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
  const { user } = req;

  res
    .cookie('jwt', user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};
exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
