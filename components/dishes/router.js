const express = require('express');
const router = express.Router();

const controller = require('./controller')
const api = require('./api')

router.get('/', controller.index);
router.get('/:id', controller.detail);

router.get('/api/subcategory/v1/:category', api.subcategory)

module.exports = router;