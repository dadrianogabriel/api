const Funko = require('../models/Funko');
const User = require('../models/User');

const create = async (req, res) => {
  const { descricao, valor, url, sale } = req?.body;
  const userId = req?.params?.id;

  if (!descricao || !valor || !sale || !userId) {
    return res.status(400).json({
      message: 'Requisição inválida!'
    });
  }

  try {
    const funkoCriado = await Funko.create({
      descricao: descricao,
      valor: valor,
      url: url,
      sale: sale,
      user: userId
    });

    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { funkos: funkoCriado._id } },
      { new: true }
    );

    res.status(201).json(result);
  } catch (error) {
    res.sendStatus(409);
  }
};

const findAll = async (req, res) => {
  const funkos = await Funko.find().populate('user', 'nome');

  if (!funkos) {
    return res.status(204).json({ message: 'Nenhum funko encontrado!' });
  }

  res.json(funkos);
};

module.exports = { create, findAll };
