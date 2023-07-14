const { Product } = require('../models/product');

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    if (product) {
      res.status(201).json({
        status: 'sucess',
        product,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.fetchAllProducts = async (req, res) => {
  const condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }
  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  // Adding query to filter the products based on category chossen

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }
  // Adding query to filter the products based brand choosen
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }
  // Adding query to sort the products based on the order like from rating : low to high
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProductsQuery = totalProductsQuery.sort({
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
    const totalDocs = await totalProductsQuery.count().exec();

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

exports.fetchProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (product) {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
