const express = require('express');
const router = express.Router();
const ctrl = require('./user.ctrl');

router.post('/', ctrl.sendEmail);

module.exports = router;