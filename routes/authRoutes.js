const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const loginSchema = require('../validate/auth/loginSchema');
const registerSchema = require('../validate/auth/registerSchema');

// Middleware de validação para a rota de login
function validateLogin(req, res, next) {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: JSON.parse(error.message) });
  }
}

// Middleware de validação para a rota de registro
function validateRegister(req, res, next) {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: JSON.parse(error.message) });
  }
}

// Rotas
router.post('/login', validateLogin, AuthController.login);
router.post('/register', validateRegister, AuthController.register);

module.exports = router;