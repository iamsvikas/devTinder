/** @format */

const express = require('express');

const app = express();

app.use('/hello', (req, res) => {
  res.send('hello!');
});
app.use('/test', (req, res) => {
  res.send('hello! testing');
});
app.listen(5173);
