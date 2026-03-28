/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary(); // Primary Key
    table.integer('user_id').unsigned().notNullable(); // Reference to user
    table.string('title').notNullable(); // e.g., "Photocopies"
    table.decimal('amount', 15, 2).notNullable(); // Handles large FCFA values
    table.enum('type', ['income', 'expense']).notNullable();
    table.string('category'); // e.g., "Food", "Transport"
    table.string('method');   // e.g., "MTN Momo", "Cash"
    table.string('status').defaultTo('Complete');
    table.datetime('date').notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at automatically
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
