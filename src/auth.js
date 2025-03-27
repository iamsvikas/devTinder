/** @format */

const adminAuth = (req, res, next) => {
  const token = 'xyz';
  const isAuthorised = token === 'xyz';
  if (isAuthorised) {
    next();
  } else {
    res.status(401).send('not authorised !');
  }
};

const userAuth = (req, res, next) => {
  const token = 'xyz';
  const isAuthorised = token === 'xyz';
  if (isAuthorised) {
    next();
  } else {
    res.status(401).send('user not authorised !');
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
