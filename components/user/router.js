const express = require('express');
const router = express.Router();

const controller = require('./controller');
const service = require('./service')

router.get('/', controller.index);

router.get('/edit/:id', controller.edit);
router.post('/edit/:id', controller.editInfo);

router.get('/change-password/:id', controller.chagePassword);
/*router.post('/change-password/:id', controller.changePasswordConfirm);*/

router.get('/my-orders', controller.orders);
router.get('/api/is-exist/:username', service.isExists)
module.exports = router;