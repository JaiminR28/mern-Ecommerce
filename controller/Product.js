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
    console.warn(error);
  }
};
