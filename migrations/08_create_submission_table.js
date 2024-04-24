exports.up = function(knex) {
    return knex.schema.createTable('submissions', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.integer('sub_event_id').unsigned().nullable();
      table.foreign('sub_event_id').references('id').inTable('sub_events');
      table.string('work_title').notNullable();
      table.text('description').notNullable();
      table.binary('archive').notNullable();
      table.datetime('submission_date').notNullable().defaultTo(knex.fn.now());
      table.string('status').notNullable().defaultTo('Pending');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('submissions');
  };