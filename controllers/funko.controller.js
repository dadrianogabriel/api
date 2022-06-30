const Funko = require('../models/Funko');
const User = require('../models/User');

const create = async (req, res) => {
  const { descricao, url, sale } = req?.body;
  let { valor } = req?.body;

  if (!valor) {
    valor = 0.0;
  }

  if (!descricao || sale === null) {
    return res.status(400).json({
      message: 'Os campos descrição, valor e sale são obrigatórios!'
    });
  }

  const usuario = await User.findOne({ _id: req?.params?.id }).exec();

  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }

  try {
    const funkoCriado = await Funko.create({
      descricao: descricao,
      valor: valor,
      url: url,
      sale: sale,
      user: req.params.id
    });

    const result = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { funkos: funkoCriado._id } },
      { new: true }
    );

    res.status(201).json({
      nome: result.nome,
      email: result.email,
      username: result.username,
      funkos: result.funkos,
      message: 'Funko cadastrado com sucesso!'
    });
  } catch (error) {
    res.sendStatus(409);
  }
};

const findAll = async (req, res) => {
  const funkos = await Funko.find().populate('user', 'nome');

  if (funkos.length === 0) {
    return res.status(204).json({ message: 'Nenhum funko encontrado!' });
  }

  res.json(funkos);
};

const update = async (req, res) => {
  const { valor, sale, descricao, url } = req?.body;

  const funko = await Funko.findOne({ _id: req.params.id });

  if (!funko) {
    return res
      .status(404)
      .json({ message: 'Nenhum Funko encontrado com esse ID!' });
  }

  if (valor != null) {
    funko.valor = valor;
  }
  if (sale != null) {
    funko.sale = sale;
  }
  if (descricao) {
    funko.descricao = descricao;
  }
  if (url) {
    funko.url = url;
  }

  try {
    const result = await funko.save();
    console.log(result);
    res.json(result);
  } catch (error) {
    res.sendStatus(409);
  }
};

const destroy = async (req, res) => {
  const funko = await Funko.findOne({ _id: req.params.id }).exec();
  const user = await User.findOne({ _id: funko.user }).exec();

  if (!funko) {
    return res
      .status(404)
      .json({ message: 'Nenhum Funko encontrado com esse ID!' });
  }

  const result = await Funko.findByIdAndRemove({ _id: req.params.id });

  if (!result) {
    return res
      .status(204)
      .json({ message: 'Nenhum Funko encontrado com esse ID!' });
  }

  await user.funkos.pull({ _id: req.params.id });
  await user.save();

  res.json(result);
};

module.exports = { create, findAll, update, destroy };
