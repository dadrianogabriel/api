const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register.controller');

router.route('/').post(registerController.createNewUser);

module.exports = router;
