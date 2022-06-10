const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nome: { type: String, required: true },
  user: { type: String, required: true },
  senha: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
