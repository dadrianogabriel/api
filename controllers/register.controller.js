const User = require('../models/User');
const bcrypt = require('bcrypt');

const createNewUser = async (req, res) => {
  const { nome, user, senha } = req.body;

  if (!nome || !user || !senha) {
    return res.status(400).json({
      message:
        'Requisição inválida. Os campos nome, user e senha são obrigatórios!'
    });
  }

  const checkDuplicate = await User.findOne({ user: user }).exec();
  if (checkDuplicate) {
    return res.sendStatus(409);
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);

    const result = await User.create({
      nome: nome,
      user: user,
      senha: hashedSenha
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(503).json({ message: err });
  }
};

module.exports = {
  createNewUser
};
