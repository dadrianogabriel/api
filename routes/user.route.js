const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.route('/').post(userController.create).get(userController.findAll);
router.route('/:id').get(userController.findOne).put(userController.update);

module.exports = router;
