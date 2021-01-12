const express = require('express');
const router = express.Router();

const controller = require('./controller');
const service = require('./service')
const api = require('./api')

router.get('/', controller.isLogin, controller.index);

router.get('/edit', controller.isLogin, controller.edit);
router.post('/edit', controller.isLogin, controller.editInfo);

router.get('/change-password', controller.isLogin, controller.chagePassword);
router.post('/change-password', controller.isLogin, controller.changePasswordConfirm);

router.get('/my-orders', controller.isLogin, controller.orders);
router.get('/dummyOrder', controller.dummy);
router.get('/dummyDetail', controller.dummyDetail);
router.get('/api/is-exist/:username', api.isExistsAPI)

router.get('/api/check-user', api.checkUserAPI)
module.exports = router;