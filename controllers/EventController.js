const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Listar todos os eventos
exports.index = async (req, res) => {
  if(!['SuperAdmin', 'Admin', 'Participante'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  try {
    const events = await db('events').select('*');
    res.json(events);

  } catch (error) {
    console.error('Erro ao obter os eventos:', error);
    res.status(500).json({ error: 'Erro ao obter os eventos' });
  }
};

// Obter um evento específico por ID
exports.show = async (req, res) => {
  if(!['SuperAdmin', 'Admin', 'Participante'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const eventId = req.params.id;
  try {

    const event = await db('events').where({ id: eventId }).first();
    if (!event) {
      res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json({data: event});

  } catch (error) {
    console.error('Erro ao obter o evento:', error);
    res.status(500).json({ error: 'Erro ao obter o evento' });
  }
};

// Criar um novo evento
exports.create = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const eventData = req.body;
  try {

    // Inserir o evento no banco de dados
    await db('events').insert(eventData);

    res.status(201).json({ success: true, message: "evento criado com sucesso"});

  } catch (error) {
    console.error('Erro ao criar o evento:', error);
    res.status(400).json({ error: 'Erro ao criar o evento', details: error });

  }
};

// Atualizar um evento existente por ID
exports.update = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const eventId = req.params.id;
  const eventData = req.body;
  try {
    // Verificar se o evento existe
    const existingEvent = await db('events').where({ id: eventId }).first();
    if (!existingEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Atualizar o evento no banco de dados
    await db('events').where({ id: eventId }).update(eventData);
    res.json({ success: true, message: 'alterado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar o evento:', error);
    res.status(400).json({ error: 'Erro ao atualizar o evento', details: error });
  }
};

// Excluir um evento existente por ID
exports.destroy = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const eventId = req.params.id;
  try {
    // Verificar se o evento existe
    const existingEvent = await db('events').where({ id: eventId }).first();
    if (!existingEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    // Excluir o evento do banco de dados
    await db('events').where({ id: eventId }).del();

    res.json({ message: 'Evento excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir o evento:', error);
    res.status(500).json({ error: 'Erro ao excluir o evento' });
  }
};