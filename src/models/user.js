/** @format */

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  emailId: String,
  password: String,
  age: Number,
  gender: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
