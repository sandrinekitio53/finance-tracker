/**
 * Migration for Savings Goals
 * Specifically designed for youth-centric financial planning.
 */
exports.up = function(knex) {
  return knex.schema.createTable('goals', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('goalName').notNullable(); // e.g., "Wifi Box"
    table.decimal('targetAmount', 15, 2).notNullable(); // FCFA Target
    table.decimal('currentAmount', 15, 2).defaultTo(0); // Progress
    table.date('deadline');
    table.string('status').defaultTo('Active'); // Active, Completed, or Paused
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('goals');
};