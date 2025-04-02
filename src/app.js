/** @format */

const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());
app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('Error saving the user!');
  }
});

app.get('/user', async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const users = await User.find({ emailId: userEmail });
    console.log(users);
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send('User not found!');
    }
  } catch (err) {
    res.status(404).send('some error ocurred!');
  }
});
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find();
    if (users.length > 0) {
      res.send(users);
    } else {
      res.status(404).send('No User found!');
    }
  } catch (err) {
    res.status(404).send('some error ocurred!');
  }
});
app.delete('/user', async (req, res) => {
  const userId = await req.body.userId;
  try {
    // const user = await User.findByIdAndDelete({ _id: userId });
    const user = await User.findByIdAndDelete(userId);
    res.send('User deleted successfully');
  } catch (err) {
    res.status(404).send('some error ocurred!');
  }
});

app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: 'after',
      runValidators: true,
    });
    res.send('User updated successfully');
  } catch (err) {
    res.status(400).send('something went wrong!');
  }
});

connectDB()
  .then(() => {
    console.log('Database connection established...');
    app.listen(5173, () => {
      console.log('server is successfully listening on port 5173');
    });
  })
  .catch((err) => console.log('Database connetion failed!'));

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
