const express = require('express');
const router = express.Router();
const controller = require('./controller')

/* GET home page. */
router.get('/', controller.index)
router.get('/home', controller.index)

router.get('/recover-password', controller.recoverPassword);
router.get('/verify', controller.verifyEmail);

module.exports = router;