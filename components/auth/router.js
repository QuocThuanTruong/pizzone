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

module.exports = router;