const { z } = require('zod');

// Esquema de validação para os dados dos usuários
const userSchema = z.object({
  name: z.string().min(1), // O nome é obrigatório e deve ter pelo menos 1 caractere
  email: z.string().email(), // O email é obrigatório e deve ser um email válido
  password: z.string(), // A senha é obrigatória
  ra: z.string(), // RA é uma string opcional
  phone: z.string(), // O telefone é uma string opcional
  type: z.number().int(), // O tipo de usuário é um número inteiro
  permission: z.string(), // A permissão é uma string opcional
});

module.exports = userSchema;