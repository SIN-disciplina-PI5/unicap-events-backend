exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('email').unique();
      table.string('password');
      table.string('ra');
      table.string('phone');
      table.string('type'); //Talvez colocar tipo de usuário como inteiro possa economizar memória (0,1,2)
      table.string('permission');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };
  