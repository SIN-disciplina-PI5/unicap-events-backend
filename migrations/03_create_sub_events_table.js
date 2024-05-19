exports.up = function(knex) {
  return knex.schema.createTable('sub_events', function(table) {
    table.increments('id').primary().notNullable();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.datetime('start_date').notNullable();
    table.datetime('end_date').notNullable();
    table.integer('event_id').unsigned().notNullable();
    table.foreign('event_id').references('id').inTable('events');
    table.integer('quantity').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('sub_events');
};