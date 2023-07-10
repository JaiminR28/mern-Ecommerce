const { Category } = require('../models/Category');

exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    if (categories) {
      res.status(200).json({
        status: 'success',
        categories,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const brand = new Category(req.body);
    await brand.save();

    if (brand) {
      res.status(201).json({
        status: 'sucess',
        brand,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
