var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('.././components/user/index');
});

router.get('/login', function(req, res, next) {
  res.render('.././components/user/index');
});

module.exports = router;