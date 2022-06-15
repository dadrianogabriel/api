const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const funkoSchema = new Schema({
  descricao: { type: String, required: true },
  valor: { type: Number, required: true },
  url: { type: String },
  sale: { type: Boolean, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Funko', funkoSchema);
