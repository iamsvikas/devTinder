/** @format */

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  gender: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
