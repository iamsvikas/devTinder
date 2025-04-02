/** @format */

const mongoose = require('mongoose');
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
    },
    password: { type: String, required: true, trim: true },
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
      default:
        'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?w=740',
    },
    skills: [],
  },
  { timestamps: true }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
