const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, senha } = req.body;

  if (!username || !senha) {
    return res
      .status(400)
      .json({ message: 'Username e senha são obrigatórios!' });
  }

  const getUser = await User.findOne({ username: username }).exec();

  if (!getUser) {
    return res.status(401).json({ message: 'Usuário inexistente!' });
  }

  const verificarSenha = await bcrypt.compare(senha, getUser.senha);

  if (verificarSenha) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: getUser.username,
          email: getUser.email,
          nome: getUser.nome
        }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5m' }
    );
    const refreshToken = jwt.sign(
      { username: getUser.username },
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
      username: getUser.username,
      nome: getUser.nome,
      email: getUser.email,
      accessToken
    });
  } else {
    res.status(401).json({ message: 'Senha inválida!' });
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
  await getUser.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
};

module.exports = { login, logout };
