const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Listar todos os usuários
exports.index = async (req, res) => {
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
  const userData = req.body;

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
  const userId = req.params.id;
  const userData = req.body;
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
    res.status(500).json({ error: 'Erro ao excluir o usuário' });
  }
};