/** @format */

const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, trim: true },
    lastName: { type: String, trim: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is not valid!');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("Password doesn't fullfill required criteria!");
      },
    },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Selected Gender is not valid!');
        }
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      default:
        'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?w=740',
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error('URL is not valid!');
        }
      },
    },
    skills: [],
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
