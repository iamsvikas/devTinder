/** @format */

const validator = require('validator');

function validateSignUpData(req) {
  const { firstName, emailId, password } = req.body;
  if (!firstName) throw new Error('First Name is a mandatory field!');
  else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid!');
  } else if (validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password!');
  }
}

module.exports = validateSignUpData;
