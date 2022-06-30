const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.sendStatus(403);
    }
    next();
  });
};

module.exports = validarJWT;
