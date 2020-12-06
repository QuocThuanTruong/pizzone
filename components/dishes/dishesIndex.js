var express = require('express');
var router = express.Router();
const dishesController = require('./dishesController')

/* GET home page. */
router.get('/', dishesController.index);

module.exports = router;