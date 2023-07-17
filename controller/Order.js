const { Order } = require('../models/Order');

exports.fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const order = await Order.find({ user: id }).populate('user');

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

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  // Adding query to sort the products based on the order like from rating : low to high
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalOrdersQuery = totalOrdersQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }

  // Adding pagination filters
  // TODO: How to get sorting from discounted price not on actual price 😅
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    const totalDocs = await totalOrdersQuery.count().exec();

    // TODO: We have to try with multiple categoeries
    res.set('X-Total-Count', totalDocs);

    if (docs) {
      res.status(200).json(docs);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
