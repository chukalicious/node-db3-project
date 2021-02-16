// scheme-model
const knex = require("knex");
const config = require("../../knexfile");

const db = knex(config.development);

module.exports = {
  find,
};

function find() {
  return db("schemes");
}
