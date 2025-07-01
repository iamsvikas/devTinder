const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectRequestModel = require("../models/connectionRequest");
const userRouter = express.Router();
const Users = require("../models/user");
const USER_SAFE_DATA = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "about",
  "skills",
];
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allRequests = await ConnectRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "data fetched successfully!",
      data: allRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allConnections = await ConnectRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Create consistent structure: always return the OTHER user
    const formattedConnections = allConnections.map((conn) => {
      return {
        connectionId: conn._id,
        status: conn.status,
        connectedUser: conn.fromUserId._id.equals(loggedInUser._id)
          ? conn.toUserId
          : conn.fromUserId,
        // connectedUser:
        // conn.fromUserId._id.toString() === loggedInUser._id.toString()
      };
    });

    res.json({
      message: "data fetched successfully!",
      data: formattedConnections,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });
    console.log({ page: typeof page, limit, skip });
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // WILL PRODUCE SAME RESULT FROM ANYONE QUERY OUT OF BOTH BELOW QUERY
    // const users = await Users.find({
    //   $and: [
    //     { _id: { $nin: Array.from(hideUsersFromFeed) } },
    //     { _id: { $ne: loggedInUser._id } },
    //   ],
    // });
    const users = await Users.find({
      _id: {
        $nin: Array.from(hideUsersFromFeed),
        $ne: loggedInUser._id,
      },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
