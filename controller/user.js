const { Users } = require('../models/User');

exports.fetchUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findById(id).exec();

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
