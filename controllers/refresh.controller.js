const User = require('../models/User');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const getUser = await User.findOne({ refreshToken }).exec();

  if (!getUser) {
    return res.sendStatus(403);
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || getUser.username !== decoded.username) {
        console.log(
          `Getuser: ${getUser.username} -- RefreshToken: ${decoded.username}`
        );
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            nome: getUser.nome,
            email: getUser.email
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
      );
      res.json({
        accessToken,
        _id: getUser._id,
        username: getUser.username,
        nome: getUser.nome,
        email: getUser.email
      });
    }
  );
};

module.exports = { refreshToken };
