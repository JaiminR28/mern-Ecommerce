const { Order } = require('../models/Order');

exports.fetchOrderByUser = async (req, res) => {
  const { user } = req.query;
  try {
    const order = await Order.find({ user: user }).populate('user');

    if (order) {
      res.status(200).json(order);
    }
  } catch (error) {
    res.status(400).json({
      status: 'No Cart Items',
      error,
    });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    if (order) {
      res.status(201).json(order);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (order) {
      res.status(200).json(order);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
