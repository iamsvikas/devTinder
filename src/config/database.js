/** @format */

const mongoose = require('mongoose');

const connectDB = async () =>
  await mongoose.connect(
    'mongodb+srv://iamsvikas:kbWXa7uhFHQRWqwG@namastenode.4uujo.mongodb.net/devTinder'
  );

module.exports = connectDB;
