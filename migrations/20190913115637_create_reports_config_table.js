
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('reports_config', table => {
      table.increments()
      table.integer('report_id').unsigned()
      table.foreign('report_id').references('id').inTable('reports').onDelete('cascade')
      table.integer('width')
      table.integer('height')
      table.string('unit')
      table.integer('page_id').unsigned()
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('reports_config')
  ])
};
