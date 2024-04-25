exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tickets').del()
    .then(function () {
      // Inserts seed entries
      return knex('tickets').insert([
        { 
          user_id: 1, 
          sub_event_id: 1, 
          status: 'reservado', 
          codigo_ingresso: 'abc123', 
          created_at: new Date(),
          updated_at: new Date(),
        },
        { 
          user_id: 2, 
          sub_event_id: 2, 
          status: 'aguardando pagamento', 
          codigo_ingresso: 'def456', 
          created_at: new Date() ,
          updated_at: new Date()
        },
        // Adicione mais ingressos falsos aqui, se necessário
      ]);
    });
};
