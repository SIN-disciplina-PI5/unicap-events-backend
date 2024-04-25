const { z } = require('zod');

// Esquema de validação para os dados da tabela de eventos
const updateSchema = z.object({
  name: z.string().min(1), // O nome é obrigatório e deve ter pelo menos 1 caractere
  description: z.string().optional(), // A descrição é opcional
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/), // Data de início no formato 'YYYY-MM-DD HH:MM:SS'
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/), // Data de término no formato 'YYYY-MM-DD HH:MM:SS'
});

module.exports = updateSchema;