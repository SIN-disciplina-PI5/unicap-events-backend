const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const createSchema = require('../validate/user/createSchema');
const updateSchema = require('../validate/user/updateSchema');

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

router.get('/', UserController.index);
router.get('/my-subscribe', UserController.mySubscribe);
router.get('/:id', UserController.show);
router.post('/', validateCreate, UserController.create);
router.put('/:id', validateUpdate, UserController.update);
router.delete('/:id', UserController.destroy);
router.put('/subscribe/:id', UserController.subscribe);

module.exports = router;