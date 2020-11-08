
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('reports_config', table => {
      table.foreign('page_id').references('id').inTable('pages').onDelete('cascade')
      table.timestamps(true, true)
      table.boolean('active', 500).defaultsTo(true)
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schem.table('reports_config', table => {
      table.dropForeign('page_id')
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
      table.dropColumn('active')
    })
  ])
};
