// scheme-model
const knex = require("knex");
const config = require("../../knexfile");

const db = knex(config.development);

module.exports = {
  find,
  findById,
};

function find() {
  return db("schemes");
}

function findById(id) {
  return db("schemes").where({ id });
}
