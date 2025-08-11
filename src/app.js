const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

const cors = require("cors");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const profileRouter = require("./routes/profile");
const userRouter = require("./routes/user");
// const cors = require("cors");
// const corsOptions = {
//   origin: "http://localhost:5173", // Replace with your frontend URL
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true, // Allow credentials (cookies) to be sent
// };
app.use(cors({ origin: "http://localhost:5173", credentials: true })); //whitelisting of the frontend url to enable storing of cookies in the browser
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, "0.0.0.0", () => {
      console.log("server is successfully listening on port 7777");
    });
  })
  .catch((err) => console.log("Database connetion failed!"));

// app.get('/user', async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const users = await User.find({ emailId: userEmail });
//     console.log(users);
//     if (users.length > 0) {
//       res.send(users);
//     } else {
//       res.status(404).send('User not found!');
//     }
//   } catch (err) {
//     res.status(404).send('some error ocurred!');
//   }
// });
// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find();
//     if (users.length > 0) {
//       res.send(users);
//     } else {
//       res.status(404).send('No User found!');
//     }
//   } catch (err) {
//     res.status(404).send('some error ocurred!');
//   }
// });
// app.delete('/user', async (req, res) => {
//   const userId = await req.body.userId;
//   try {
//     // const user = await User.findByIdAndDelete({ _id: userId });
//     const user = await User.findByIdAndDelete(userId);
//     res.send('User deleted successfully');
//   } catch (err) {
//     res.status(404).send('some error ocurred!');
//   }
// });

// app.patch('/user', async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;
//   if (req.body.skills?.length > 10)
//     throw new Error('maximum 10 skills allowed!');
//   console.log(data);
//   try {
//     await User.findByIdAndUpdate({ _id: userId }, data, {
//       returnDocument: 'after',
//       runValidators: true,
//     });
//     res.send('User updated successfully');
//   } catch (err) {
//     res.status(400).send('something went wrong!');
//   }
// });

/* 
const mongoose = require('mongoose');

const express = require('express');
// require('./config/database');
const app = express();

mongoose
  .connect(
    'mongodb+srv://iamsvikas:kbWXa7uhFHQRWqwG@namastenode.4uujo.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode'
  )
  .then(() => {
    app.listen(5173, () => {
      console.log('server is successfully listening on port 5173');
    });
  })
  .catch((error) => {
    console.log('Error connecting to db', error);
  });
*/
