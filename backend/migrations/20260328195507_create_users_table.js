/**
 * Migration for the Users Table
 * Highly structured for professional authentication.
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('email').unique().notNullable(); // Prevents duplicate accounts
    table.string('password').notNullable(); // Will store hashed passwords
    table.string('phoneNumber'); // Useful for MoMo/Orange Money integration
    table.string('profileColor').defaultTo('#6366f1'); // For the UI theme
    table.timestamps(true, true); // created_at and updated_at
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};