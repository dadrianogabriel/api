const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;

  if (!auth?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const token = auth.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.sendStatus(403);
    }
    req.user = decoded.UserInfo.username;
    next();
  });
};

module.exports = validarJWT;
