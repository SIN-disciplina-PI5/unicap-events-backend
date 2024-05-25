const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Listar todos os subeventos
exports.index = async (req, res) => {
  if(!['SuperAdmin', 'Admin', 'Participante'].includes(req.authUser.permission)){
    return res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteúdo!'});
  }

  const { event_id } = req.query;

  try {
    const subEvents = await db('sub_events')
      // .join('events', 'sub_events.event_id', '=', 'events.id')
      .join('events', function() {
        this.on('sub_events.event_id', '=', 'events.id');
        if (event_id) {
          this.andOn('events.id', '=', db.raw('?', [event_id]));
        }
      })
      .join('addresses', 'sub_events.id', '=', 'addresses.sub_event_id')
      .join('tickets', 'sub_events.id', '=', 'tickets.sub_event_id')
      .leftJoin('users', 'tickets.user_id', '=', 'users.id')
      .select(
        'sub_events.id as sub_event_id',
        'sub_events.name as sub_event_name',
        'sub_events.description as sub_event_description',
        'sub_events.start_date as sub_event_start_date',
        'sub_events.end_date as sub_event_end_date',
        'sub_events.quantity as sub_event_quantity',
        'sub_events.created_at as sub_event_created_at',
        'sub_events.updated_at as sub_event_updated_at',
        'events.id as event_id',
        'events.name as event_name',
        'events.description as event_description',
        'events.start_date as event_start_date',
        'events.end_date as event_end_date',
        'events.created_at as event_created_at',
        'events.updated_at as event_updated_at',
        'addresses.block',
        'addresses.room',
        'tickets.id as ticket_id',
        'tickets.user_id',
        'tickets.status',
        'tickets.codigo_ingresso',
        'users.id as user_id',
        'users.name as user_name',
        'users.email as user_email'
      );

    // const subEvents = await subEventsQuery;

    const subEventForId = {};

    subEvents.forEach(subEvent => {
      const id = subEvent.sub_event_id;
      if (!subEventForId[id]) {
        subEventForId[id] = {
          id: subEvent.sub_event_id,
          name: subEvent.sub_event_name,
          description: subEvent.sub_event_description,
          start_date: subEvent.sub_event_start_date,
          end_date: subEvent.sub_event_end_date,
          quantity: subEvent.sub_event_quantity,
          created_at: subEvent.sub_event_created_at,
          updated_at: subEvent.sub_event_updated_at,
          event: {
            id: subEvent.event_id,
            name: subEvent.event_name,
            description: subEvent.event_description,
            start_date: subEvent.event_start_date,
            end_date: subEvent.event_end_date,
            created_at: subEvent.event_created_at,
            updated_at: subEvent.event_updated_at
          },
          address: {
            block: subEvent.block,
            room: subEvent.room
          },
          tickets: []
        };
      }
      if (['SuperAdmin', 'Admin'].includes(req.authUser.permission)) {
        subEventForId[id].tickets.push({
          id: subEvent.ticket_id,
          user_id: subEvent.user_id,
          status: subEvent.status,
          codigo_ingresso: subEvent.codigo_ingresso,
          user: subEvent.user_id ? {
            id: subEvent.user_id,
            name: subEvent.user_name,
            email: subEvent.user_email
          } : null
        });
      }
    });

    Object.values(subEventForId).forEach(subEvent => {
      subEvent.tickets_available = subEvent.tickets.filter(ticket => ticket.status === 'disponivel').length;
    });

    res.json({ data: Object.values(subEventForId) });
  } catch (error) {
    console.error('Erro ao obter os subeventos:', error);
    res.status(500).json({ error: 'Erro ao obter os subeventos' });
  }
};

// Obter um subevento específico por ID
exports.show = async (req, res) => {
  const subEventId = req.params.id;
  if(!['SuperAdmin', 'Admin', 'Participante'].includes(req.authUser.permission)){
    return res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteúdo!'});
  }
  try {
    const subEvents = await db('sub_events')
      .leftJoin('events', 'sub_events.event_id', '=', 'events.id')
      .leftJoin('addresses', 'sub_events.id', '=', 'addresses.sub_event_id')
      .leftJoin('tickets', 'sub_events.id', '=', 'tickets.sub_event_id')
      .leftJoin('users', 'tickets.user_id', '=', 'users.id')
      .select(
        'sub_events.id as sub_event_id',
        'sub_events.name as sub_event_name',
        'sub_events.description as sub_event_description',
        'sub_events.start_date as sub_event_start_date',
        'sub_events.end_date as sub_event_end_date',
        'sub_events.quantity as sub_event_quantity',
        'sub_events.created_at as sub_event_created_at',
        'sub_events.updated_at as sub_event_updated_at',
        'events.id as event_id',
        'events.name as event_name',
        'events.description as event_description',
        'events.start_date as event_start_date',
        'events.end_date as event_end_date',
        'events.created_at as event_created_at',
        'events.updated_at as event_updated_at',
        'addresses.block',
        'addresses.room',
        'tickets.id as ticket_id',
        'tickets.user_id',
        'tickets.status',
        'tickets.codigo_ingresso',
        'users.id as user_id',
        'users.name as user_name',
        'users.email as user_email',
      )
      .where('sub_events.id', subEventId);

    if (subEvents.length === 0) {
      return res.status(404).json({ error: 'Subevento não encontrado' });
    }

    const subEventForId = {
      id: subEvents[0].sub_event_id,
      name: subEvents[0].sub_event_name,
      description: subEvents[0].sub_event_description,
      start_date: subEvents[0].sub_event_start_date,
      end_date: subEvents[0].sub_event_end_date,
      quantity: subEvents[0].sub_event_quantity,
      created_at: subEvents[0].sub_event_created_at,
      updated_at: subEvents[0].sub_event_updated_at,
      event: {
        id: subEvents[0].event_id,
        name: subEvents[0].event_name,
        description: subEvents[0].event_description,
        start_date: subEvents[0].event_start_date,
        end_date: subEvents[0].event_end_date,
        created_at: subEvents[0].event_created_at,
        updated_at: subEvents[0].event_updated_at
      },
      address: {
        block: subEvents[0].block,
        room: subEvents[0].room
      },
      tickets: []
    };

    subEvents.forEach(subEvent => {
      if (['SuperAdmin', 'Admin'].includes(req.authUser.permission)) {
        subEventForId.tickets.push({
          id: subEvent.ticket_id,
          user_id: subEvent.user_id,
          status: subEvent.status,
          codigo_ingresso: subEvent.codigo_ingresso,
          user: subEvent.user_id ? {
            id: subEvent.user_id,
            name: subEvent.user_name,
            email: subEvent.user_email
          } : null
        });
      }
    });
    
    subEventForId.tickets_available = subEventForId.tickets.filter(ticket => ticket.status === 'disponivel').length;


    res.json({ data: subEventForId });
  } catch (error) {
    console.error('Erro ao obter o subevento:', error);
    res.status(500).json({ error: 'Erro ao obter o subevento' });
  }
};


// Criar um novo subevento
exports.create = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const { name, description, start_date, end_date, event_id, quantity, address } = req.body;

  try {
    // Inserir o subevento no banco de dados
    const subEventId = await db('sub_events').insert({ name, description, start_date, end_date, event_id, quantity }).returning('id');

    address.sub_event_id = subEventId[0].id;
    // Inserir o endereço associado ao subevento
    await db('addresses').insert(address);

    // Create an array to store ticket objects
    const tickets = [];

    // Loop through the quantity to generate tickets
    for (let i = 0; i < quantity; i++) {

      // Create a ticket object for each iteration
      tickets.push({
        user_id: null, // Set user_id to null initially (can be updated later)
        sub_event_id: subEventId[0].id,
        status: 'disponivel', // Set status to 'available' by default
        codigo_ingresso: crypto.randomUUID(),
      });
    }

    await db('tickets').insert(tickets);


    res.status(201).json({ success: true, message: "Subevento criado com sucesso" });
  } catch (error) {
    console.error('Erro ao criar o subevento:', error);
    res.status(400).json({ error: 'Erro ao criar o subevento', details: error });
  }
};

// Atualizar um subevento existente por ID
exports.update = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
  const subEventId = req.params.id;
  const { name, description, start_date, end_date, event_id, quantity, address } = req.body;

  try {
    // Verificar se o subevento existe
    const existingSubEvent = await db('sub_events').where({ id: subEventId }).first();
    if (!existingSubEvent) {
      return res.status(404).json({ error: 'Subevento não encontrado' });
    }

    // Atualizar o subevento no banco de dados
    await db('sub_events').where({ id: subEventId }).update({ name, description, start_date, end_date, event_id, quantity });

    // Atualizar o endereço associado ao subevento
    await db('addresses').where({ sub_event_id: subEventId }).update(address);

    res.status(201).json({ success: true, message: "Subevento atualizado com sucesso" });
  } catch (error) {
    console.error('Erro ao atualizar o subevento:', error);
    res.status(400).json({ error: 'Erro ao atualizar o subevento', details: error });
  }
};

// Excluir um subevento existente por ID
exports.destroy = async (req, res) => {
  const subEventId = req.params.id;
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }

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