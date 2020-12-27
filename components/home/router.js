const express = require('express');
const router = express.Router();
const controller = require('./controller')

/* GET home page. */
router.get('/', controller.index)
router.get('/home', controller.index)

module.exports = router;