const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Listar todos os subeventos
exports.index = async (req, res) => {
  try {
    const subEvents = await db('sub_events')
                            .join('events', 'sub_events.event_id', 'events.id')
                            .select('sub_events.*', 'events.*');
console.log(subEvents);
    res.json({data: subEvents});

  } catch (error) {
    console.error('Erro ao obter os subeventos:', error);
    res.status(500).json({ error: 'Erro ao obter os subeventos' });
  }
};

// Obter um subevento específico por ID
exports.show = async (req, res) => {
  const subEventId = req.params.id;

  try {
    const subEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!subEvent) {
      res.status(404).json({ error: 'Subevento não encontrado' });
    }

    res.json({data: subEvent});

  } catch (error) {
    console.error('Erro ao obter o subevento:', error);
    res.status(500).json({ error: 'Erro ao obter o subevento' });
  }
};

// Criar um novo subevento
exports.create = async (req, res) => {
  const subEventData = req.body;

  try {
    // Inserir o subevento no banco de dados
    await db('sub_events').insert(subEventData);

    res.status(201).json({ success: true, message: "sub evento criado com sucesso"});

  } catch (error) {
    console.error('Erro ao criar o subevento:', error);
    res.status(400).json({ error: 'Erro ao criar o subevento', details: error });
  }
};

// Atualizar um subevento existente por ID
exports.update = async (req, res) => {
  const subEventId = req.params.id;
  const subEventData = req.body;

  try {

    // Verificar se o subevento existe
    const existingSubEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!existingSubEvent) {
      return res.status(404).json({ error: 'Sub evento não encontrado' });
    }

    // Atualizar o subevento no banco de dados
    await db('sub_events').where({ id: subEventId }).update(subEventData);

    res.status(201).json({ success: true, message: "Sub evento atualizado com sucesso"});

  } catch (error) {
    console.error('Erro ao atualizar o subevento:', error);
    res.status(400).json({ error: 'Erro ao atualizar o sub evento', details: error });
  }
};

// Excluir um subevento existente por ID
exports.destroy = async (req, res) => {
  const subEventId = req.params.id;

  try {
    // Verificar se o subevento existe
    const existingSubEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!existingSubEvent) {
      return res.status(404).json({ error: 'Sub evento não encontrado' });
    }

    // Excluir o subevento do banco de dados
    await db('sub_events').where({ id: subEventId }).del();

    res.json({ message: 'Sub evento excluído com sucesso' });

  } catch (error) {
    console.error('Erro ao excluir o subevento:', error);
    res.status(500).json({ error: 'Erro ao excluir o subevento' });
  }
};
