const express = require("express");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: hashedPassword,
  });
  try {
    validateSignUpData(req);
    if (req.body.skills?.length > 10)
      throw new Error("maximum 10 skills allowed!");
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    res.json({ message: "User added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found!");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials!");
    }
    const token = await user.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(`Error during login: ${error.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
    });
    res.send("user logout successfully!");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Server error during logout.");
  }
});

module.exports = authRouter;
