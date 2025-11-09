const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

router.get('/', UserController.index);
router.get('/:id', UserController.show);
router.post('/', UserController.store);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
