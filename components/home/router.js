const express = require('express');
const router = express.Router();
const controller = require('./controller')

/* GET home page. */
router.get('/', controller.index)
router.get('/home', controller.index)
router.get('/login', controller.login)
router.get('/register', controller.register)

router.get('/recover-password', controller.recoverPassword);
router.post('/recover-password', controller.updatePassword);
router.get('/verify', controller.verifyEmail);
router.get('/resend', controller.resend);


module.exports = router;