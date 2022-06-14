require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnection = require('./database/dbConn');
const PORT = process.env.PORT || 3500;
const validarJWT = require('./middleware/validarJWT');

dbConnection();

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/refresh', require('./routes/refresh.route'));

app.use(validarJWT);
app.use('/api/user', require('./routes/user.route'));

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB com sucesso!');
  app.listen(PORT, () =>
    console.log(`Servidor escutando a porta ${process.env.PORT}`)
  );
});
