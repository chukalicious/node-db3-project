// scheme-model
const knex = require("knex");
const config = require("../../knexfile");

const db = knex(config.development);

module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
};

function find() {
  return db("schemes");
}

function findById(id) {
  //this method returns and array with the item by the id
  //or, an empty array if no item by the id was found
  //   return db("schemes").where({ id });
  //this other method returns a single user (no array)
  // or resolves to null if no item bu the id
  return db("schemes").where({ id }).first();
  //it's also better for the front end ;)
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then((ids) => {
      return findById(ids[0]);
    });
}

function update(id, scheme) {
  return db("schemes").where("id", Number(id)).update(scheme);
}

function remove(id) {
  return db("schemes").where("id", Number(id)).del();
}

function findSteps(id) {
  return db("schemes")
    .join("steps", "schemes.id", "steps.scheme_id")
    .where("steps.id", id)
    .select("steps.*");
}
