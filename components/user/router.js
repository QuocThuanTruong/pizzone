const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);
router.get('/edit', controller.edit);
router.get('/change-password', controller.chagePassword);

module.exports = router;