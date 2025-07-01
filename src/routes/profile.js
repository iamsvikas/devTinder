const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfile } = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    return res.status(400).send(`Error: ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit Request!");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${req.user.firstName}, your profile updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (req.body.newPassword !== req.body.confirmPassword) {
      throw new Error("New password and confirm password do not match!");
    }

    loggedInUser.password = await bcrypt.hash(req.body.newPassword, 10);
    await loggedInUser.save();
    res.json({
      message: `${req.user.firstName}, your password updated successfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = profileRouter;
