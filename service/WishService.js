'use strict';

let sqlDb;
var utils = require('../utils/writer.js');
var userService = require("./UserService.js");

exports.wishesDbSetup = function (connection) {
  sqlDb = connection;
  return sqlDb.schema.hasTable('wishes').then(exists => {
    if (!exists) return initWishesTable()
    else console.log("Table 'wishes' already exists.")
  })
}

function initWishesTable() {
  console.log("Table 'wishes' does not exist. Creating it...");
  var wishes = sqlDb.schema.createTable("wishes", table => {
    table.increments('id').primary();
    table.string('user').notNullable();
    table.string('bookId').notNullable();
    table.foreign('user').references("users.username").onDelete('CASCADE');
  });
  console.log("Table 'wishes' created.");
  return wishes;
}

/**
 * Delete the wish of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the wish.
 * no response value expected for this operation
 **/
exports.deleteUserWish = async (username, id) => {
  try {
    const [wish] = await sqlDb('wishes')
      .where({ id: id, user: username })
      .returning('*')
      .del();

    if (!wish)
      return utils.respondWithCode(404);
    else
      return utils.respondWithCode(200);

  } catch (error) {
    return utils.respondWithCode(500);
  }
}


/**
 * Get the wish of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the wish.
 * returns Wish
 **/
exports.getUserWish = async (username, id) => {
  try {
    if (!(userService.findUser(username)))
      return utils.respondWithCode(404);

    const wish = await sqlDb('wishes').where({ user: username, id: id }).first();
    if (!wish) return utils.respondWithCode(404);

    return utils.respondWithCode(200, wish);

  } catch (error) {
    return utils.respondWithCode(500);
  }
}


/**
 * Get all the books the user wish to own.
 *
 * username String Username of the user whose wishes are to be obtained.
 * returns List
 **/
exports.getUserWishes = async (username) => {
  try {

    if (!(userService.findUser(username)))
      return utils.respondWithCode(404);

    const wishes = await sqlDb('wishes').where({ user: username });
    return utils.respondWithCode(200, wishes);

  } catch (error) {
    return utils.respondWithCode(500);
  }
}


/**
 * Add a wish for the user with the given username.
 *
 * body Wish New wish object.
 * username String Username of the user.
 * returns Wish
 **/

exports.postUserWish = async (body, username) => {

  try {
    const bookId = body['bookId'];

    if (!username || !bookId)
      return utils.respondWithCode(400);

    if (!(await userService.findUser(username)))
      return utils.respondWithCode(404);

    if (await sqlDb('properties').where({ owner: username, bookId: bookId }).first())
      return utils.respondWithCode(406);

    if (await sqlDb('wishes').where({ user: username, bookId: bookId }).first())
      return utils.respondWithCode(409);

    const [wish] = await sqlDb('wishes').insert({
      user: username,
      bookId: bookId
    }, '*');

    return utils.respondWithCode(201, wish);
  } catch (error) {
    return utils.respondWithCode(500);
  }
}
