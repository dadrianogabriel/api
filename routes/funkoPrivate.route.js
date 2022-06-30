const express = require('express');
const router = express.Router();
const funkoController = require('../controllers/funko.controller');

router
  .route('/:id')
  .post(funkoController.create)
  .put(funkoController.update)
  .delete(funkoController.destroy);

module.exports = router;
