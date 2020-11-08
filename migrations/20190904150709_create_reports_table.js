
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('reports', table => {
      table.increments()
      table.string('name', 500)
      table.integer('conn_id', 255).unsigned()
      table.foreign('conn_id').references('id').inTable('connections').onDelete('cascade')
      table.string('query', 1000)
      table.string('description', 100)
      table.string('chart_type', 500)
      table.string('x', 100)
      table.string('y', 100)
      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('reports')
  ])
};
