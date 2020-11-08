
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('reports', table => {
      table.boolean('active').defaultsTo(true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('reports', table => {
      table.dropColumn('active')
    })
  ])
};
