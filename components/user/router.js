const express = require('express');
const router = express.Router();

const controller = require('./controller');
const service = require('./service')
const api = require('./api')

router.get('/', controller.index);

router.get('/edit', controller.edit);
router.post('/edit', controller.editInfo);

router.get('/change-password', controller.chagePassword);
router.post('/change-password', controller.changePasswordConfirm);

router.get('/my-orders', controller.orders);
router.get('/api/is-exist/:username', api.isExistsAPI)

router.get('/api/check-user', api.checkUserAPI)
module.exports = router;