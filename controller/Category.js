const { Category } = require('../models/Category');

exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();

    if (categories) {
      res.status(200).json(categories);
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
    const category = new Category(req.body);
    await category.save();

    if (category) {
      res.status(201).json(category);
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};
