const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const createSchema = require('../validate/event/createSchema');
const updateSchema = require('../validate/event/updateSchema');

// Middleware de validação para a rota de login
function validateCreate(req, res, next) {
  try {
    createSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Middleware de validação para a rota de registro
function validateUpdate(req, res, next) {
  try {
    updateSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

router.get('/', EventController.index);
router.get('/:id', EventController.show);
router.post('/', validateCreate, EventController.create);
router.put('/:id', validateUpdate, EventController.update);
router.delete('/:id', EventController.destroy);

module.exports = router;