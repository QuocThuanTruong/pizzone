const express = require('express');
const router = express.Router();

const controller = require('./controller');


router.get('/', controller.order)
router.get('/cancel', controller.cancel);

module.exports = router;