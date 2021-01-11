const express = require('express')
const router = express.Router();

const controller = require('./controller')

router.get('/', controller.postedReview)
router.get('/paging/:id', controller.reviewPagination);

module.exports = router;

