const express = require('express');
const router = express.Router();
const homeController = require('./controller')

/* GET home page. */
router.get('/', homeController.index)
router.get('/home', homeController.index)

module.exports = router;