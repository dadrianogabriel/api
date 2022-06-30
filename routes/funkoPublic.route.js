const express = require('express');
const router = express.Router();
const funkoController = require('../controllers/funko.controller');

router.route('/').get(funkoController.findAll);

module.exports = router;
