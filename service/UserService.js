'use strict';

let sqlDb;
var utils = require('../utils/writer.js');

exports.usersDbSetup = function (connection) {
  sqlDb = connection;
  return sqlDb.schema.hasTable('users').then(exists => {
    if (!exists) return initUsersTable()
    else console.log("Table 'users' already exists.")
  })
}

function initUsersTable() {
  console.log("Table 'users' does not exist. Creating it...");
  var users = sqlDb.schema.createTable("users", table => {
    table.string('username').primary();
    table.string('name');
    table.string('surname');
    table.string('email').notNullable();
    table.string('password').notNullable();
  });
  console.log("Table 'users' created.");
  return users;
}

/**
 * Add a new user to Delibrary.
 *
 * body User New user object.
 * no response value expected for this operation
 **/
exports.addUser = function (body) {
  return new Promise((resolve, reject) => {

    console.log("Adding new user to the database...");

    // TODO check that the operation is authorized

    const username = body['username'];
    const name = body['name'];
    const surname = body['surname'];
    const email = body['email'];
    const password = body['password'];

    if (!username || !password || ! email) {
      console.error("User not added: non-nullable field is empty.")
      return reject(utils.respondWithCode(400))
    }

    // Check if the username is already used.
    return sqlDb('users')
      .where({ username: username })
      .first().then((user) => {
        if (user) {
          console.error("There's already a user with username " + username);
          return reject(utils.respondWithCode(409))
        } else {
          return sqlDb('users').insert({
            username: username,
            name: name,
            surname: surname,
            email: email,
            password: password
          }).then(() => {
            console.log(`User ${username} successfully added to the database.`)
            return findUser(username)
              .then((user) => {
                return resolve(utils.respondWithCode(201, hidePassword(user)))
              }).catch((error) => {
                console.error("ERROR: " + error)
                return reject(utils.respondWithCode(500))
              });
          }).catch((error) => {
            console.error("ERROR: " + error)
            return reject(utils.respondWithCode(500))
          });
        }
      }).catch((error) => console.error(error))
  })
}

function hidePassword(user) {
  let userWithoutPassword = user;
  userWithoutPassword['password'] = null;
  return userWithoutPassword;
}

/**
 * Delete the user with the given ID.
 *
 * username String username of the user to delete.
 * no response value expected for this operation
 **/
exports.deleteUser = function (username) {
  return new Promise((resolve, reject) => {

    console.log("Deleting user " + username + " from the database...")

    return findUser(username).then((user) => {
      if (!user) {
        console.error("User not found.")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('users')
          .where({ username: username })
          .del()
          .then(() => {
            console.log("User " + username + " successfully deleted from the database.")
            return resolve(utils.respondWithCode(200))
          }).catch((error) => {
            console.error(error)
            return reject(utils.respondWithCode(500))
          })
      }
    })
  });
}

// Return a promise that contains the user with the given username, if it is present inside the database.
exports.findUser = function (username) {
  return sqlDb('users')
    .where({ username: username })
    .first()
}

function findUser(username) {
  return sqlDb('users')
    .where({ username: username })
    .first()
}


/**
 * Get the user with the given username.
 *
 * username String Username of the user to get.
 * returns User
 **/
exports.getUserByUsername = function (username) {
  return new Promise(function (resolve, reject) {

    console.log("Looking for user " + username)

    return findUser(username).then((user) => {
      if (!user) {
        console.log("There are no users with the given username.")
        return reject(utils.respondWithCode(404))
      } else {
        console.log("User " + username + " found.")
        return resolve(utils.respondWithCode(200, hidePassword(user)))
      }
    })
      .catch((error) => {
        console.error(error)
        return reject(utils.respondWithCode(500))
      })
  });
}


/**
 * Get all Delibrary users.
 *
 * returns List
 **/
exports.getUsers = function () {
  return new Promise(function (resolve, reject) {
    console.log("Returning all the users inside the database.")
    return sqlDb('users')
      .then((users) => {
        return resolve(utils.respondWithCode(200, users.map(hidePassword)))
      })
      .catch((error) => {
        console.error(error.details)
        reject(utils.respondWithCode(500))
      })
  });
}


/**
 * Update the user with the given username.
 * This can only be done by the logged in user.
 *
 * username String Username of the user to update.
 * body User Updated version of the user object.
 * no response value expected for this operation
 **/
exports.updateUser = function (username, body) {
  return new Promise(function (resolve, reject) {

    console.log("Updating user " + username + "...")

    // 1. TODO check authorizations
    // 2. check there's a user with the given username
    return findUser(username).then((user) => {
      if (!user) {
        console.log("There is no user with username " + username)
        return reject(utils.respondWithCode(404))
      } else {
        console.log("User " + username + " found. Updating...")

        const name = body['name']
        const surname = body['surname']
        const email = body['email']

        // 3. replace user informations
        return sqlDb('users')
          .where({ username: username })
          .update({
            name: name,
            surname: surname,
            email: email
          }).then(() => {
            return sqlDb('users').where({ username: username }).first()
              .then((user) => {
                console.log("User " + username + " successfully updated.")
                return resolve(utils.respondWithCode(201, hidePassword(user)))
              }).catch(error) ((error) => {
                console.error(error)
                return reject(utils.respondWithCode(404))
              })
          }).catch((error) => {
            console.error(error)
            return reject(utils.respondWithCode(404))
          })
      }
    }).catch((error) => {
      console.error(error)
      return reject(utils.respondWithCode(404))
    })
  });
}

