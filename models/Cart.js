const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    min: 0,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
  },
});

const virtual = CartSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

CartSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Cart = mongoose.model('Cart', CartSchema);
