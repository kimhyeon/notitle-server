const express = require('express');
const router = express.Router();
const ctrl = require('./users.ctrl');

router.post('/', ctrl.insert);

// router.get('/', ctrl.select);
router.get('/:id', ctrl.selectUserByID);
// router.get('/', ctrl.selectUsersByName);

router.put('/', ctrl.update);
router.delete('/', ctrl.remove);

// router.post('/login', () => {});
// router.post('/logout', () => {});

module.exports = router;
