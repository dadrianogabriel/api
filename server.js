require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConnection = require('./database/dbConn');

dbConnection();

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/user', require('./routes/user.route'));
app.use('/api/auth', require('./routes/auth.route'));

mongoose.connection.once('open', () => {
  console.log('Conectado ao MongoDB com sucesso!');
  app.listen(process.env.PORT || 3500, () =>
    console.log(`Servidor escutando a porta ${process.env.PORT}`)
  );
});
