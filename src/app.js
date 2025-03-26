/** @format */

const express = require('express');

const app = express();

app.get('/user', (req, res) => {
  res.send('received users successfully!!');
});

app.post('/user', (req, res) => {
  res.send('stored data successfully!');
});

app.delete('/user', (req, res) => {
  res.send('deleted data successfully!');
});

app.put('/user', (req, res) => {
  res.send('updated user successfully!');
});

app.patch('/user', (req, res) => {
  res.send('user details updated!');
});
app.use('/test', (req, res) => {
  res.send('hello! testing');
});
app.listen(5173);
