const { z } = require('zod');

// Esquema de validação para os dados dos usuários
const userSchema = z.object({
  name: z.string().min(1), // O nome é obrigatório e deve ter pelo menos 1 caractere
  email: z.string().email(), // O email é obrigatório e deve ser um email válido
  password: z.string(), // A senha é obrigatória
  confirm_password: z.string().min(6), // O confirmar senha é obrigatório e deve ter pelo menos 6 caracteres
  ra: z.string(), // RA é uma string opcional
  phone: z.string(), // O telefone é uma string opcional
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords must match",
  path: ["confirm_password"], // Path to show the error
});

module.exports = userSchema;