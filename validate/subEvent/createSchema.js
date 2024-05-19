const { z } = require('zod');

// Esquema de validação para o endereço
const addressSchema = z.object({
  block: z.string().min(1),
  room: z.string().min(1),
});

// Esquema de validação para os dados da tabela de subeventos
const createSchema = z.object({
  name: z.string().min(1), // O nome é obrigatório e deve ter pelo menos 1 caractere
  description: z.string().min(1), // A descrição é obrigatória e deve ter pelo menos 1 caractere
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/), // Data de início no formato 'YYYY-MM-DD HH:MM:SS'
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/), // Data de término no formato 'YYYY-MM-DD HH:MM:SS'
  event_id: z.number().int().positive(), // O ID do evento é obrigatório e deve ser um número inteiro positivo
  quantity: z.number().int().positive(), // A quantidade é obrigatória e deve ser um número inteiro positivo
  address: addressSchema
});

module.exports = createSchema;