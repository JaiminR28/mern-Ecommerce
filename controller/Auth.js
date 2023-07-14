const { Users } = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const user = new Users(req.body);
    const doc = await user.save();

    if (doc) {
      res.status(201).json({ id: doc.id, role: doc.role });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email }).exec();

    // this is just temp. , we will use strong password encription later
    if (!user) {
      res.status(401).json({ message: 'no such user email' });
    } else if (user.password === req.body.password) {
      res.status(201).json({ id: user.id, role: user.role });
    } else {
      res.status(401).json({ message: 'Invalid Crendentials' });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
