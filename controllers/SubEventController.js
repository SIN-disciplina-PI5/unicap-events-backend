const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Listar todos os subeventos
exports.index = async (req, res) => {
  try {
    const subEvents = await db('sub_events')
                            .join('events', 'sub_events.event_id', '=', 'events.id')
                            .leftJoin('addresses', 'sub_events.id', '=', 'addresses.sub_event_id')
                            .leftJoin('tickets', 'sub_events.id', '=', 'tickets.sub_event_id')
                            .select(
                              'sub_events.*', 
                              'events.*', 
                              'addresses.*', 
                              'tickets.*'
                            );

    // Organizar os dados de forma aninhada
    const nestedData = subEvents.map(subEvent => {
      return {
        id: subEvent.id,
        name: subEvent.name,
        description: subEvent.description,
        start_date: subEvent.start_date,
        end_date: subEvent.end_date,
        value: subEvent.value,
        quantity: subEvent.quantity,
        created_at: subEvent.created_at,
        updated_at: subEvent.updated_at,
        event: {
          id: subEvent.event_id,
          name: subEvent.name,
          description: subEvent.description,
          start_date: subEvent.start_date,
          end_date: subEvent.end_date,
          created_at: subEvent.created_at,
          updated_at: subEvent.updated_at
        },
        address: {
          block: subEvent.block,
          room: subEvent.room
        },
        tickets: {
          status: subEvent.status,
          codigo_ingresso: subEvent.codigo_ingresso
        }
      };
    });

    res.json({ data: nestedData });
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
  const { name, description, start_date, end_date, event_id, value, quantity, address } = req.body;

  try {
    // Inserir o subevento no banco de dados
    const subEventId = await db('sub_events').insert({ name, description, start_date, end_date, event_id, value, quantity });
    
    // Inserir o endereço associado ao subevento
    await db('sub_event_addresses').insert({ sub_event_id: subEventId[0], ...address });

    res.status(201).json({ success: true, message: "Subevento criado com sucesso" });
  } catch (error) {
    console.error('Erro ao criar o subevento:', error);
    res.status(400).json({ error: 'Erro ao criar o subevento', details: error });
  }
};

// Atualizar um subevento existente por ID
exports.update = async (req, res) => {
  const subEventId = req.params.id;
  const { name, description, start_date, end_date, event_id, value, quantity, address } = req.body;

  try {
    // Verificar se o subevento existe
    const existingSubEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!existingSubEvent) {
      return res.status(404).json({ error: 'Subevento não encontrado' });
    }

    // Atualizar o subevento no banco de dados
    await db('sub_events').where({ id: subEventId }).update({ name, description, start_date, end_date, event_id, value, quantity });

    // Atualizar o endereço associado ao subevento
    await db('sub_event_addresses').where({ sub_event_id: subEventId }).update(address);

    res.status(201).json({ success: true, message: "Subevento atualizado com sucesso" });
  } catch (error) {
    console.error('Erro ao atualizar o subevento:', error);
    res.status(400).json({ error: 'Erro ao atualizar o subevento', details: error });
  }
};

// Excluir um subevento existente por ID
exports.destroy = async (req, res) => {
  const subEventId = req.params.id;

  try {
    // Verificar se o subevento existe
    const existingSubEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!existingSubEvent) {
      return res.status(404).json({ error: 'Subevento não encontrado' });
    }

    // Excluir o subevento do banco de dados
    await db('sub_events').where({ id: subEventId }).del();

    // Excluir o endereço do sub_event subevento do banco de dados
    await db('addresses').where({ sub_event_id: subEventId }).del();

    res.json({ message: 'Subevento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir o subevento:', error);
    res.status(500).json({ error: 'Erro ao excluir o subevento' });
  }
};