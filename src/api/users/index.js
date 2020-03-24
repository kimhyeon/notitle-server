const express = require('express');
const router = express.Router();
const ctrl = require('./users.ctrl');

router.post('/', ctrl.insert);

// router.get('/', ctrl.select);
router.get('/', ctrl.selectUsersByName);
router.get('/:id', ctrl.selectUserByID);

router.put('/:id', ctrl.update);
router.delete('/', ctrl.remove);

// router.post('/login', () => {});
// router.post('/logout', () => {});

module.exports = router;
