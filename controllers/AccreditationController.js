const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

// Obter um ticket específico por ID
exports.show = async (req, res) => {
  console.log(res)
  const codigoIngresso = req.params.id;
  try {
    const codigo = await db('tickets').where('codigo_ingresso', codigoIngresso ).where('status', 'aprovado').first();
    if (!codigo) {
      res.status(404).json({ success: false, message: 'codigo não encontrado'});
    }

    res.json({success: true, message: 'codigo é valido'});

  } catch (error) {
    console.error('Erro ao obter se o evento é valido:', error);
    res.status(500).json({ error: 'Erro ao obter se o evento é valido:' });
  }
};

// Atualizar um evento existente por ID
exports.update = async (req, res) => {
  const codigo_ingresso = req.params.id;

  try {
    // Verificar se o ticket existe e se está atribuido a algum usuario
    const existingTicket = await db('tickets').where('codigo_ingresso', codigo_ingresso).whereNotNull('user_id').first();

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket não encontrado ou não tem usuario atrelado ao ingresso' });
    }
    
    // Atualizar o ticket no banco de dados
    await db('tickets').where({ codigo_ingresso: codigo_ingresso }).update({status: 'aprovado'});

    res.json({ success: true, message: 'alterado com sucesso'});

  } catch (error) {
    console.error('Erro ao atualizar o evento:', error);
    res.status(400).json({ error: 'Erro ao credenciar', details: error });
  }
};