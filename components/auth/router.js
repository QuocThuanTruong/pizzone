const express = require('express');
const router = express.Router();
const controller = require('./controller')
const passport = require('./passport')

router.post('/register', controller.register)

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true })
);

router.get('/logout', controller.logout)
module.exports = router;