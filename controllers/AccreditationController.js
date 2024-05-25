const knex = require('knex');
const knexFile = require('../knexfile.js');
const db = knex(knexFile);

const createCertificate = require('../service/createCertificate');
const sendEmail = require('../service/sendEmail');
const fs = require('fs');

// Obter um ticket específico por ID
exports.show = async (req, res) => {
  if(!['SuperAdmin', 'Admin'].includes(req.authUser.permission)){
    res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteudo!'});
  }
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
  if (!['SuperAdmin', 'Admin'].includes(req.authUser.permission)) {
    return res.status(403).json({ success: false, message: 'Você não tem autorização para acessar esse conteúdo!' });
  }

  const codigo_ingresso = req.params.id;

  try {
    // Verificar se o ticket existe e se está atribuído a algum usuário
    const ticket = await db('tickets')
      .join('users', 'tickets.user_id', '=', 'users.id')
      .join('sub_events', 'tickets.sub_event_id', '=', 'sub_events.id')
      .where('tickets.codigo_ingresso', codigo_ingresso)
      .where('status', 'reservado')
      .whereNotNull('tickets.user_id')
      .select(
        'tickets.*',
        'users.name as user_name',
        'users.email as user_email',
        'sub_events.name as sub_event_name'
      )
      .first();

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado ou não tem usuário atrelado ao ingresso' });
    }

    // Gerar e enviar o certificado
    await generateAndSendCertificate(ticket.user_name, ticket.sub_event_name, ticket.user_email, ticket.codigo_ingresso)
      .then(() => console.log('Certificate sent successfully!'))
      .catch(err => {
        console.error('Error sending certificate:', err);
        throw err; // Lança o erro para ser tratado no bloco catch
      });

    // Atualizar o ticket no banco de dados
    await db('tickets').where({ codigo_ingresso: codigo_ingresso }).update({ status: 'aprovado' });

    res.json({ success: true, message: 'Ticket atualizado e certificado enviado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar o ticket:', error);
    res.status(400).json({ error: 'Erro ao credenciar', details: error });
  }
};

async function generateAndSendCertificate(name, course, email, codigoIngresso) {
  const certificatePath = `certificado - ${name}.pdf`;

  // Cria o certificado
  createCertificate(name, course, codigoIngresso);

  // Espera a criação do arquivo
  await new Promise(resolve => setTimeout(resolve, 1000)); // Ajuste conforme necessário

  // Envia o email com o certificado
  await sendEmail(email, 'Seu Certificado do Curso', 'Essa é sua certificação! Parabéns!', certificatePath);

  // Remove o arquivo após envio
  fs.unlinkSync(certificatePath);
}