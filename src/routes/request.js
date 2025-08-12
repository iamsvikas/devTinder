const express = require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter = express.Router();
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status; // ignored or interseted

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status: ${status}` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { toUserId: fromUserId, fromUserId: toUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already exists" });
      }
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      const emailRes = await sendEmail.run();
      console.log(emailRes);

      res.json({
        message: `${req.user.firstName} has ${
          status === "interested" ? "shown interest in" : "ignored"
        } ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status))
        return res.status(400).json({ message: "Invalid Status!" });
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser,
        status: "interested",
      });
      if (!connectionRequest)
        return res
          .status(404)
          .json({ message: "connection request not found!" });
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "connection status:" + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
