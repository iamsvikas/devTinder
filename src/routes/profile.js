/** @format */

const express = require('express');
const { userAuth } = require('../middleware/auth');

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
  } catch (err) {}
});
module.exports = profileRouter;
