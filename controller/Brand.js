const { Brands } = require('../models/Brand');

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brands.find({}).exec();

    if (brands) {
      res.status(200).json({
        status: 'success',
        brands,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error,
    });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const brand = new Brands(req.body);
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
