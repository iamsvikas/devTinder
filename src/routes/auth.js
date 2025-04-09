/** @format */

const express = require('express');
const bcrypt = require('bcrypt');
const authRouter = express.Router();
const validateSignUpData = require('../utils/validation');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });
  try {
    validateSignUpData(req);
    if (req.body.skills?.length > 10)
      throw new Error('maximum 10 skills allowed!');
    const user = new User(userData);
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('ERROR: ' + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send('User not found!');
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid credentials!');
    }
    const token = await user.getJWT();

    res.cookie('token', token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    return res.status(200).send('Login successful!');
  } catch (error) {
    return res.status(400).send(`Error during login: ${error.message}`);
  }
});

authRouter.post('/logout', async (req, res) => {
  res.cookie('token', null, { expires: new Date(Date.now()) });
  res.send('user logout successfully!');
});

module.exports = authRouter;
