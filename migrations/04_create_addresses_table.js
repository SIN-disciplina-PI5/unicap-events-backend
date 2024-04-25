exports.up = function(knex) {
  return knex.schema.createTable('addresses', function(table) {
    table.increments('id').primary();
    table.integer('sub_event_id').unsigned().notNullable();
    table.foreign('sub_event_id').references('id').inTable('sub_events');
    table.string('block').notNullable();
    table.string('room').notNullable(); //Room ficaria mais intuitivo
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('addresses');
};
