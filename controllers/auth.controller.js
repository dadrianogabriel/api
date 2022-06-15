const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { user, senha } = req.body;

  if (!user || !senha) {
    return res
      .status(400)
      .json({ message: 'Username e senha são obrigatórios!' });
  }

  const getUser = await User.findOne({ user: user }).exec();

  if (!getUser) {
    return res.sendStatus(401);
  }

  const verificarSenha = await bcrypt.compare(senha, getUser.senha);

  if (verificarSenha) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          user: getUser.user,
          email: getUser.email,
          nome: getUser.nome
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    const refreshToken = jwt.sign(
      { user: getUser.user },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    getUser.refreshToken = refreshToken;
    await getUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      _id: getUser._id,
      user: getUser.user,
      nome: getUser.nome,
      email: getUser.email,
      accessToken
    });
  } else {
    res.sendStatus(401);
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;

  const getUser = await User.findOne({ refreshToken }).exec();
  if (!getUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  getUser.refreshToken = '';
  await foundUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

module.exports = { login, logout };
