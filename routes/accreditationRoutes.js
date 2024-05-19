const express = require('express');
const router = express.Router();
const AccreditationController = require('../controllers/AccreditationController');

const AuthMiddleware = require('../middleware/AuthMiddleware.js');
router.use(AuthMiddleware);

router.get('/:id', AccreditationController.show);
router.put('/:id', AccreditationController.update);

module.exports = router;