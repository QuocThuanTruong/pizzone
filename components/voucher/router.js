const express = require('express');
const router = express.Router();

const api = require('./api')

router.get('/api/v1/isExistsVoucher/:code', api.isExistsVoucher)

module.exports = router;