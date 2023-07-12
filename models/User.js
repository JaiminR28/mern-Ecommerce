const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
  },
  addresses: {
    type: [mongoose.Mixed],
  },
  name: {
    type: String,
  },
  orders: {
    type: [mongoose.Mixed],
  },
});

const virtual = UserSchema.virtual('id');
virtual.get(function () {
  return this._id;
});

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.Users = mongoose.model('Users', UserSchema);
