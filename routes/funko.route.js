const express = require('express');
const router = express.Router();
const funkoController = require('../controllers/funko.controller');

router.route('/').get(funkoController.findAll);
router.route('/:id').post(funkoController.create);

module.exports = router;
