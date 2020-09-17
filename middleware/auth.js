const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get the token from the Header
  const token = req.header('x-auth-token');

  // check if no token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'No token, Authorization denied .. :( ' });
  }

  try {
    const decode = jwt.verify(token, config.get('jwtSecret'));
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid .. :(' });
  }
};
