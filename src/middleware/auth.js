const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const adminAuth = (req, res, next) => {
//   const token = 'xyz';
//   const isAuthorised = token === 'xyz';
//   if (isAuthorised) {
//     next();
//   } else {
//     res.status(401).send('not authorised !');
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login first");
    }
    const decodedObj = await jwt.verify(token, "Dev@tinder1234");
    const { userId } = decodedObj;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error: " + err.message);
  }
};

module.exports = {
  // adminAuth,
  userAuth,
};
