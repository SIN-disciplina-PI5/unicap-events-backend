const express = require('express');
const router = express.Router();
const SubEventController = require('../controllers/SubEventController');
const createSchema = require('../validate/subEvent/createSchema');
const updateSchema = require('../validate/subEvent/updateSchema');

const AuthMiddleware = require('../middleware/AuthMiddleware.js');
router.use(AuthMiddleware);

// Middleware de validação para a rota de login
function validateCreate(req, res, next) {
  try {
    createSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: JSON.parse(error.message) });
  }
}

// Middleware de validação para a rota de registro
function validateUpdate(req, res, next) {
  try {
    updateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: JSON.parse(error.message) });
  }
}

router.get('/', SubEventController.index);
router.get('/:id', SubEventController.show);
router.post('/', validateCreate, SubEventController.create);
router.put('/:id', validateUpdate, SubEventController.update);
router.delete('/:id', SubEventController.destroy);

module.exports = router;