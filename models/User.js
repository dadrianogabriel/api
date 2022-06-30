const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nome: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  refreshToken: { type: String },
  funkos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Funko'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
