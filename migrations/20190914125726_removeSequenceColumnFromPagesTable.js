
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('pages', table => {
      table.dropColumn('sequence')
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('pages', table => {
      table.string('sequence')
    })
  ])
};
