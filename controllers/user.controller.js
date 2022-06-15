const User = require('../models/User');
const bcrypt = require('bcrypt');

const create = async (req, res) => {
  const { nome, user, senha, email } = req.body;

  if (!nome || !user || !senha || !email) {
    return res.status(400).json({
      message:
        'Requisição inválida. Os campos nome, user, senha e email são obrigatórios!'
    });
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await User.create({
      nome: nome,
      user: user,
      email: email,
      senha: hashedSenha
    });

    res.status(201).json(result);
  } catch (error) {
    res.sendStatus(409);
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
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'É necessário um ID!' });
  }

  const usuario = await User.find({ _id: req.params.id }).populate('funkos');

  if (!usuario) {
    return res
      .status(204)
      .json({ message: 'Nenhum usuário encontrado com esse ID!' });
  }

  res.json(usuario);
};

const update = async (req, res) => {
  const { user, email, senha } = req?.body;

  if (!req?.params?.id) {
    return res.status(400).json({ message: 'É necessário um ID!' });
  }

  const usuario = await User.findOne({ _id: req.params.id }).exec();

  if (!usuario) {
    return res
      .status(204)
      .json({ message: 'Nenhum usuário encontrado com esse ID!' });
  }

  if (senha) {
    const hashedSenha = await bcrypt.hash(senha, 10);
    usuario.senha = hashedSenha;
  }
  if (email) {
    usuario.email = email;
  }
  if (user) {
    usuario.user = user;
  }

  try {
    const result = await usuario.save();
    res.json(result);
  } catch (error) {
    res.sendStatus(409);
  }
};

module.exports = {
  create,
  findAll,
  findOne,
  update
};
