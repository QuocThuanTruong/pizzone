const express = require('express');
const router = express.Router();

const controller = require('./controller');
const userController = require('../user/controller');

router.get('/', userController.isLogin, controller.index)
router.get('/checkout', userController.isLogin, controller.checkout);
router.get('/change/:id', controller.add);

module.exports = router;