const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: [0, 'Wrong min Price'],
    max: [10000000, 'Wrong max Price'],
    required: true,
  },

  discountPercentage: {
    type: Number,
    min: [1, 'Minimum discount should be 1%'],
    max: [99, 'Cannot have more than 100% discount'],
  },

  rating: {
    type: Number,
    min: [0, 'Minimum rating should be 0'],
    max: [5, 'Minimum rating should be not be give above 5'],
    default: 0,
  },
  stock: {
    type: Number,
    min: [0, 'Minimum rating should be 0'],
    required: true,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const virtual = ProductSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Product = mongoose.model('Product', ProductSchema);
