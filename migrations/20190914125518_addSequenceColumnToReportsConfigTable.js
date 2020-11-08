
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('reports_config', table => {
      table.integer('sequence')
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('reports_config', table => {
      table.dropColumn('sequence')
    })
  ])
};
