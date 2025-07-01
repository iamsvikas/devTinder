const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
          throw new Error("Email is not valid!");
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
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported!",
      },
      // validate(value) {
      //   if (!['male', 'female', 'others'].includes(value)) {
      //     throw new Error('Selected Gender is not valid!');
      //   }
      // },
    },
    photoUrl: {
      type: String,
      trim: true,
      default:
        "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?w=740",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("URL is not valid!");
        }
      },
    },
    skills: [],
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ userId: user._id }, "Dev@tinder1234", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHashed = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHashed
  );
  return isPasswordValid;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
