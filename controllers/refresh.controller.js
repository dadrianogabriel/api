const User = require('../models/User');
const jwt = require('jsonwebtoken');

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

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
      if (error || getUser.user !== decoded.user) {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            user: decoded.user
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      res.json({ accessToken });
    }
  );

  console.log('teste');
};

module.exports = { refreshToken };
