
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('connections', table => {
      table.increments()
      table.string('dbtype', 255).notNullable()
      table.string('hostname', 500)
      table.string('user', 500)
      table.string('password', 500)
      table.string('dbname', 500)
      table.timestamps(true, true)
      table.boolean('active', 500).defaultTo(true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('connections')
  ])
};
