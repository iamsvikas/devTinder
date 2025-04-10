/** @format */

const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateEditProfile } = require('../utils/validation');
const profileRouter = express.Router();

profileRouter.get('/profile/view', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    return res.status(400).send(`Error: ${error.message}`);
  }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error('Invalid Edit Request!');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${req.user.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

profileRouter.patch('/profile/password', async (req, res) => {});
module.exports = profileRouter;
