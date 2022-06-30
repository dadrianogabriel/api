const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router
  .route('/:id')
  .put(userController.update)
  .get(userController.findOne)
  .delete(userController.destroy);

module.exports = router;
