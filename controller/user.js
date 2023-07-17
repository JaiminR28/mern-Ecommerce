const { Users } = require('../models/User');

// exports.fetchUserById = async (req, res) => {
//   console.log('user', req.user);
//   const { id } = req.user;
//   try {
//     const user = await Users.findById(id).exec();

//     if (user) {
//       res.status(200).json({
//         id: user.id,
//         addresses: user.addresses,
//         email: user.email,
//         role: user.role,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       status: 'error',
//       error,
//     });
//   }
// };

exports.fetchUserById = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await Users.findById(id);
    res.status(200).json({
      id: user.id,
      addresses: user.addresses,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(400).json(err);
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
