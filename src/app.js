/** @format */

const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());
app.post('/signup', async (req, res) => {
  const user = new User(req.body);
  // const user = new User({
  //   firstName: 'Vikas',
  //   lastName: 'Sharma',
  //   emailId: 'vikas@sharma.com',
  //   password: 'vikas@123',
  // });
  try {
    await user.save();
    res.send('User added successfully!');
  } catch (err) {
    res.status(400).send('Error saving the user!');
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
