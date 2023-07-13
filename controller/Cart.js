const { Cart } = require('../models/Cart');

exports.fetchCartByUser = async (req, res) => {
  const { user } = req.query;
  console.log(user);
  try {
    const UserCart = await Cart.find({ user: user })
      .populate('user')
      .populate('product');

    if (UserCart) {
      res.status(200).json(UserCart);
    }
  } catch (error) {
    res.status(400).json({
      status: 'No Cart Items',
      error,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    await cartItem.save();

    if (cartItem) {
      res.status(201).json(cartItem);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
