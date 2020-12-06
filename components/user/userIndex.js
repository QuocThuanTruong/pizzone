var express = require('express');
var router = express.Router();
const userController = require('./userController');

/* GET home page. */
router.get('/', userController.index);

module.exports = router;