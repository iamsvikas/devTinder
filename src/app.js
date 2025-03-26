/** @format */

const express = require('express');

const app = express();
const { adminAuth, userAuth } = require('./middleware/auth');
app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res) => {
  res.send('All Data sent!');
});

app.get('/user/getUser', userAuth, (req, res) => {
  res.send('user data sent!');
});

app.post('/user/login', (req, res) => {
  res.send('user login successfully!');
});
app.listen(5173);
