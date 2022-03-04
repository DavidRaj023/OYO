const jwt = require('jsonwebtoken');
const config =require('../config/authConfig');

function authenticateToken (req, res, next) {
  const token = req.headers.authtoken;

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, config.authSecret, (err, data) => {
    if (err) return res.status(400).send(err.message);
    req.user = data;
    next()
  })
}

module.exports = authenticateToken;