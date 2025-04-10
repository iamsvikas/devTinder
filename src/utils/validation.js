/** @format */

const validator = require('validator');

function validateSignUpData(req) {
  const { firstName, emailId, password } = req.body;
  if (!firstName) throw new Error('First Name is a mandatory field!');
  else if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid!');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password!');
  }
}

function validateEditProfile(req) {
  const allowEditFields = [
    'firstName',
    'lastName',
    'gender',
    'photoUrl',
    'age',
    'about',
    'skills',
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field)
  );
  return isEditAllowed;
}

module.exports = { validateSignUpData, validateEditProfile };
