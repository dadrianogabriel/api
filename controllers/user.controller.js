const User = require('../models/User');
const Funko = require('../models/Funko');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const create = async (req, res) => {
  const { nome, username, senha, email } = req.body;

  if (!nome || !username || !senha || !email) {
    return res.status(400).json({
      message:
        'Requisição inválida. Os campos nome, username, senha e email são obrigatórios!'
    });
  }

  const verificarDuplicados = await User.find({
    $or: [{ username: username }, { email: email }]
  });

  if (verificarDuplicados.length !== 0) {
    return res
      .status(409)
      .json({ message: 'Email ou username já cadastrado!' });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await User.create({
      nome,
      username,
      email,
      senha: hashedSenha
    });

    res.status(201).json({
      _id: result.id,
      nome: result.nome,
      username: result.username,
      email: result.email,
      message: 'Usuário cadastrado com sucesso!'
    });
  } catch (error) {
    res.status(503).json({ message: error });
  }
};

const findAll = async (req, res) => {
  const usuarios = await User.find().populate('funkos');

  if (!usuarios) {
    return res.status(204).json({ message: 'Nenhum usuário encontrado!' });
  }

  res.json(usuarios);
};

const findOne = async (req, res) => {
  try {
    const usuario = await User.findOne({ _id: req.params.id }).populate(
      'funkos'
    );

    if (usuario.length === 0) {
      return res
        .status(404)
        .json({ message: 'Nenhum usuário encontrado com esse ID!' });
    }

    res.json(usuario);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const update = async (req, res) => {
  const { username, email, senha } = req?.body;
  let usuario;

  try {
    usuario = await User.findOne({ _id: req.params.id }).exec();
  } catch (error) {
    return res.status(400).json({ message: error });
  }

  if (!usuario) {
    return res
      .status(404)
      .json({ message: 'Nenhum usuário encontrado com esse ID!' });
  }

  if (senha) {
    const hashedSenha = await bcrypt.hash(senha, 10);
    usuario.senha = hashedSenha;
  }
  if (email) {
    usuario.email = email;
  }
  if (username) {
    usuario.username = username;
  }

  try {
    const refreshToken = jwt.sign(
      { username: usuario.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    usuario.refreshToken = refreshToken;

    const result = await usuario.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
      _id: result.id,
      username: result.username,
      nome: result.nome,
      email: result.email
    });
  } catch (error) {
    res.sendStatus(409);
  }
};

const destroy = async (req, res) => {
  try {
    const usuario = await User.findOne({ _id: req.params.id }).exec();

    if (!usuario) {
      return res
        .status(404)
        .json({ message: 'Nenhum usuário encontrado com esse ID!' });
    }

    await Funko.deleteMany({ user: req.params.id });
    const result = await usuario.deleteOne({ _id: req.params.id });

    res.json(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update,
  destroy
};
