
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('connections', table => {
      table.string('port')
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('connections', table => {
      table.dropColumn('port')
    })
  ])
};
