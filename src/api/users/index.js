const express = require('express');
const router = express.Router();
const ctrl = require('./users.ctrl');

router.post('/login', ctrl.login);
router.get('/login', ctrl.isAuthenticated);
router.post('/logout', ctrl.logout);

router.post('/', ctrl.insert);

router.get('/', ctrl.selectUsersByName);
router.get('/:id', ctrl.selectUserByID);

router.put(['', '/:id'], ctrl.update);

router.delete(['', '/:id'], ctrl.remove);

module.exports = router;
