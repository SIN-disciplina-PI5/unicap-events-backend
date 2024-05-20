const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);
const { initializeApp } = require("@firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken, signOut } = require("firebase/auth");
const firebaseJson = require('../firebaseCredentials.json');

// Inicializa o módulo de autenti
const auth = getAuth(initializeApp(firebaseJson));

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Autentica o usuário com o email e a senha
    const firebaseUser = await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // O usuário foi autenticado com sucesso
      const firebaseUser = userCredential.user;
      
      return firebaseUser;

    });

    const userDB = await db('users').where('email', firebaseUser.user.email).first();
    if(!userDB){
        return res.sendStatus(401);
    }

    const data = {
      token: firebaseUser.user.stsTokenManager.accessToken,
      permission: userDB.permission
    }

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

    await db('users').insert(registerData);

    var errorMessage = false;
    // Se o e-mail não estiver em uso, cria o usuário
    await createUserWithEmailAndPassword(auth, registerData.email, registerData.password)
      .then((userCredential) => {
        console.log('user criado');
      })
      .catch((error) => {
        errorMessage = true;
      });

    if (errorMessage == true) {
      return res.status(500).json({ error: "usuario já existe" });
    }

    await trx.commit();

    return res.status(201).json({ message: "Usuário registrado com sucesso" });

  } catch {
    return res.status(500).json({ error: "Erro ao registrar usuário" });

  }

};