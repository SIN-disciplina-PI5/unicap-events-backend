const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);
const { initializeApp } = require("@firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCustomToken, signOut } = require("firebase/auth");
const firebaseJson = require('../firebaseCredentials.json');
// Inicializa o módulo de autenti
const auth = getAuth(initializeApp(firebaseJson));

// Listar todos os usuários
exports.index = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  try {
    const users = await db('users').select('*');
    res.json({data: users}, 200);

  } catch (error) {
    console.error('Erro ao obter os usuários:', error);
    res.status(500).json({ error: 'Erro ao obter os usuários' });
  }
};

// Obter um usuário específico por ID
exports.show = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const userId = req.params.id;
  try {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);

  } catch (error) {
    console.error('Erro ao obter o usuário:', error);
    res.status(500).json({ error: 'Erro ao obter o usuário' });
  }
};

// Criar um novo usuário
exports.create = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const userData = req.body;
  delete userData.confirm_password;
  try {
     // Usando transação do Knex
    const trx = await db.transaction();

    await db('users').insert(userData);

    var errorMessage = false;
    // Se o e-mail não estiver em uso, cria o usuário
    await createUserWithEmailAndPassword(auth, userData.email, userData.password)
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

    res.status(201).json({ success: true, message: "usuario criado com sucesso"});

  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    res.status(400).json({ error: 'Erro ao criar o usuário', details: error });
  }
};

// Atualizar um usuário existente por ID
exports.update = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const userId = req.params.id;
  const userData = req.body;

  delete userData.confirm_password;
  try {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await db('users').where({ id: userId }).update(userData);
    res.status(201).json({ success: true, message: "usuario atualizado com sucesso"});
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error);
    res.status(400).json({ error: 'Erro ao atualizar o usuário', details: error });
  }
};

// Excluir um usuário existente por ID
exports.destroy = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const userId = req.params.id;
  try {
    const user = await db('users').where({ id: userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await db('users').where({ id: userId }).del();
    res.json({ message: 'Usuário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o usuário:', error);
    res.status(500).json({ error: 'Erro ao excluir o usuário' });
  }
};

exports.subscribe = async (req, res) => {
  try {
    const subEventId = req.params.id;

    // Inicia uma transação
    const trx = await db.transaction();
    const userId = req.authUser.id;

    // Seleciona um ticket disponível de forma aleatória
    const ticket = await trx('tickets')
      .where('sub_event_id', subEventId)
      .where('status', 'disponivel')
      .orderByRaw('RANDOM()') // Para PostgreSQL use 'RANDOM()' em vez de 'RAND()'
      .first();

    if (!ticket) {
      return res.status(404).json({ error: 'Nenhum ticket disponível encontrado' });
    }

    // Atualiza o ticket selecionado para associar ao usuário
    await trx('tickets')
      .where('id', ticket.id)
      .update({
        user_id: userId,
        status: 'reservado'
      });

    // Confirma a transação
    await trx.commit();

    res.json({
       message: 'Inscrição feita com sucesso',
       codigo_ingresso: ticket.codigo_ingresso
      }); 

  } catch (error) {
    console.error('Erro ao associar ticket:', error);

  }
}