const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // Check for a token in the header
  const token = req.header('x-auth-token');

  // Check if is not a token
  if (!token) {
    return res.status(401).json({ msg: 'No token! Auth Denied' });
  }
  // If there's a token
  try {
    //Verify it
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    //Assign it to req.user
    req.user = decoded.user;
    //Then go on...
    next();
  } catch (err) {
    //If token is not a valid one...
    return res.status(401).json({ msg: 'Token Not Valid' });
  }
};
