const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.post('/', ctrl.insert);

module.exports = router;
