const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

const { initializeApp } = require("@firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const firebaseJson = require('../firebaseCredentials.json');

// Inicializa o módulo de autenticação do Firebase
const auth = getAuth(initializeApp(firebaseJson));

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Autentica o usuário com o email e a senha
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDB = await db('users').where('email', firebaseUser.email).first();
    if (!userDB) {
      return res.sendStatus(401);
    }

    const data = {
      token: firebaseUser.stsTokenManager.accessToken,
      permission: userDB.permission
    };

    return res.status(200).json({ message: "Autenticação bem-sucedida", data });

  } catch (error) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }
};

exports.register = async (req, res) => {
  const registerData = req.body;

  registerData.type = "Participante";
  registerData.permission = "Participante";
  delete registerData.confirm_password;

  try {
    // Usando transação do Knex
    const trx = await db.transaction();

    await db('users').insert(registerData).transacting(trx);

    try {
      // Se o e-mail não estiver em uso, cria o usuário no Firebase
      await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      await trx.commit();
      return res.status(201).json({ message: "Usuário registrado com sucesso" });
    } catch (firebaseError) {
      await trx.rollback();
      return res.status(500).json({ error: "Usuário já existe no Firebase" });
    }
  } catch (dbError) {
    return res.status(500).json({ error: "Erro ao registrar usuário no banco de dados" });
  }
};