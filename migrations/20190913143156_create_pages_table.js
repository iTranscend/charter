
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('pages', table => {
      table.increments()
      table.string('name')
      table.string('sequence')
      table.timestamps(true, true)
      table.boolean('active', 500).defaultTo(true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.createTable('pages')
  ])
};
