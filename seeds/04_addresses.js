exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('addresses').del()
    .then(function () {
      // Inserts seed entries
      return knex('addresses').insert([
        { sub_event_id: 1, block: 'A', room: '202' },
        { sub_event_id: 2, block: 'B', room: '303' },
        // Adicione mais endereços falsos aqui, se necessário
      ]);
    });
};
