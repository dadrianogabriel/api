const User = require('../models/User');
const bcrypt = require('bcrypt');

const createNewUser = async (req, res) => {
  const { nome, user, senha, email } = req.body;

  if (!nome || !user || !senha || !email) {
    return res.status(400).json({
      message:
        'Requisição inválida. Os campos nome, user, senha e email são obrigatórios!'
    });
  }

  const verificarDuplicados = await User.find({
    $or: [{ user: user }, { email: email }]
  });

  if (verificarDuplicados.length !== 0) {
    return res.sendStatus(409);
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
  } catch (err) {
    res.status(503).json({ message: err });
  }
};

module.exports = {
  createNewUser
};
