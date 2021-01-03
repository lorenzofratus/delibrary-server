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
exports.deleteUserWish = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Deleting wish from the database...")

    return userService.findUser(username).then((user) => {
        if (!user) {
          console.error("No users with the given username")
          return reject(utils.respondWithCode(404))
        } else {
          return sqlDb('wishes')
            .where({ id: id })
            .del()
            .then(() => {
              console.log("Wish " + id + " successfully deleted from the database.")
              return resolve(utils.respondWithCode(200))
            }).catch((error) => {
              console.error(error)
              return reject(utils.respondWithCode(500))
            })
        }
      })
  });
}


/**
 * Get the wish of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the wish.
 * returns Wish
 **/
exports.getUserWish = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Looking for wish " + id)

    return userService.findUser(username).then((user) => {
      if(!user) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('wishes')
        .where({ user: username, id: id })
        .first()
        .then((wish) => {
          if (!wish) {
            console.log("There are no wish with the given username and id.")
            return reject(utils.respondWithCode(404))
          } else {
            console.log("Wish found.")
            return resolve(utils.respondWithCode(200, wish))
          }
        })
        .catch((error) => {
          console.error(error)
          return reject(utils.respondWithCode(500))
        })
      }
    })

  });
}


/**
 * Get all the books the user wish to own.
 *
 * username String Username of the user whose wishes are to be obtained.
 * returns List
 **/
exports.getUserWishes = function (username) {
  return new Promise(function (resolve, reject) {
    console.log("Returning all the wishes of " + username + ".")
    return userService.findUser(username).then((user) => {
        if (!user) {
          console.log("There are no user with the given username.")
          return reject(utils.respondWithCode(404))
        } else {
          return sqlDb('wishes')
            .where({ user: username })
            .then((wishes) => {
              return resolve(utils.respondWithCode(200, wishes))
            })
            .catch((error) => {
              console.error(error)
              reject(utils.respondWithCode(500))
            })
        }
      })
      .catch((error) => {
        console.error(error)
        return reject(utils.respondWithCode(500))
      })
  })
}


/**
 * Add a wish for the user with the given username.
 *
 * body Wish New wish object.
 * username String Username of the user.
 * returns Wish
 **/
exports.postUserWish = function (body, username) {
  return new Promise(function (resolve, reject) {
    console.log("Adding new wish to the database...");

    // TODO check that the operation is authorized

    const user = username;
    const bookId = body['bookId'];

    if (!user || !bookId) {
      console.error("Wish not added: empty user or bookId.")
      return reject(utils.respondWithCode(400))
    }

    // TODO check the user object is valid.

    // Check if the wish is already stored.
    return userService.findUser(username).then((userFound) => {
      if(!userFound) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('wishes')
        .where({ user: user, bookId: bookId })
        .first()
        .then((wish) => {
          if (wish) {
            console.error("There's already a wish with for the given bookId and username.")
            return reject(utils.respondWithCode(409))
          } else {
            return sqlDb('wishes').insert({
              user: user,
              bookId: bookId
            }).then(() => {
              console.log(`Wish successfully added to the database.`)
              return sqlDb('wishes')
                .where({ user: user, bookId: bookId })
                .first()
                .then((wish) => {
                  return resolve(utils.respondWithCode(201, wish))
                })
            }).catch((error) => {
              console.error("ERROR: " + error)
              return reject(utils.respondWithCode(500))
            });
          }
        }).catch((error) => {
          console.error("ERROR: " + error)
          return reject(utils.respondWithCode(500))
        })
      }
    })
  })
}

