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
    const userId = req.authUser.id;

    // Inicia uma transação
    const trx = await db.transaction();

    try {
      // Verifica se o usuário já está inscrito no sub-evento
      const user = await trx('tickets')
        .where('sub_event_id', subEventId)
        .where('user_id', userId)
        .first();

      if (user) {
        await trx.rollback();
        return res.status(400).json({ error: 'Usuário já inscrito no evento' });
      }

      // Seleciona um ticket disponível de forma aleatória
      const ticket = await trx('tickets')
        .where('sub_event_id', subEventId)
        .where('status', 'disponivel')
        .orderByRaw('RANDOM()') // Para PostgreSQL use 'RANDOM()' em vez de 'RAND()'
        .first();

      if (!ticket) {
        await trx.rollback();
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
      // Se houver qualquer erro, reverte a transação
      await trx.rollback();
      console.error('Erro ao associar ticket:', error);
      return res.status(500).json({ error: 'Erro ao associar ticket' });
    }
  } catch (error) {
    console.error('Erro ao iniciar transação:', error);
    return res.status(500).json({ error: 'Erro ao iniciar transação' });
  }
};

exports.mySubscribe = async (req, res) => {
  const userId = req.authUser.id;
  try {
    // Consulta ao banco de dados para recuperar as inscrições do usuário
    const registrations = await db('tickets')
    .where('user_id', userId)
    .join('sub_events', 'tickets.sub_event_id', '=', 'sub_events.id')
    .select(
      'sub_events.id as sub_event_id',
      'sub_events.name as sub_event_name',
      'sub_events.description as sub_event_description',
      'sub_events.start_date as sub_event_start_date',
      'sub_events.end_date as sub_event_end_date',
      'tickets.status',
      'tickets.codigo_ingresso'
    );

    res.json({
      data: registrations
    });
  } catch (error) {
    console.error('Erro ao listar as inscrições em subeventos:', error);
    throw error;
  }
}