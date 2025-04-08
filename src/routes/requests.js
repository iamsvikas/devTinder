/** @format */

const express = require('express');
const { userAuth } = require('../middleware/auth');
const requestRouter = express.Router();

requestRouter.post('/sendConnectRequest', userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + ' has sent request!');
  } catch (err) {
    console.log('ERROR: ' + err.message);
  }
});

module.exports = requestRouter;
