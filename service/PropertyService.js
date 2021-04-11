'use strict';

let sqlDb;
var utils = require('../utils/writer.js');
var userService = require("./UserService.js");

exports.propertiesDbSetup = function (connection) {
  sqlDb = connection;
  return sqlDb.schema.hasTable('properties').then(exists => {
    if (!exists) return initInterestsTable()
    else console.log("Table 'properties' already exists.")
  })
}

function initInterestsTable() {
  console.log("Table 'properties' does not exist. Creating it...");
  var properties = sqlDb.schema.createTable("properties", table => {
    table.increments('id').primary();
    table.string('owner').notNullable();
    table.foreign('owner').references('username').inTable('users').onDelete('CASCADE');
    table.string('bookId').notNullable();
    table.string('town').notNullable();
    table.string("province").notNullable();
  });
  console.log("Table 'properties' created.");
  return properties;
}

/**
 * Delete the property of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the property.
 * no response value expected for this operation
 **/
exports.deleteUserProperty = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Deleting property from the database...")

    return userService.findUser(username).then((foundUser) => {
      if (!foundUser) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        sqlDb('properties')
          .where({ owner: username, id: id })
          .first()
          .then((user) => {
            if (!user) {
              console.error("No users with the given username")
              return reject(utils.respondWithCode(404))
            } else {
              return sqlDb('properties')
                .where({ owner: username, id: id })
                .del()
                .then(() => {
                  console.log("Property " + id + " successfully deleted from the database.")
                  return resolve(utils.respondWithCode(200))
                }).catch((error) => {
                  console.error(error)
                  return reject(utils.respondWithCode(500))
                })
            }
          })
      }
    })
  });
}


/**
 * Get all the books the user owns.
 *
 * username String Username of the user whose properties are to be obtained.
 * returns List
 **/
exports.getUserProperties = function (username) {
  return new Promise(function (resolve, reject) {
    console.log("Getting properties of user " + username + "...")
    return userService.findUser(username).then((foundUser) => {
      if (!foundUser) {
        console.log("There are no user with the given username.")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('properties')
          .where({ owner: username })
          .then((properties) => {
            console.log("Returning properties.")
            return resolve(utils.respondWithCode(200, properties))
          })
          .catch((error) => {
            console.error(error.details)
            reject(utils.respondWithCode(500))
          })
      }
    }).catch((error) => {
      console.error(error)
      return reject(utils.respondWithCode(500))
    })
  })
}


/**
 * Get the property of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the property.
 * returns Property
 **/
exports.getUserProperty = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Looking for property " + id)

    return userService.findUser(username).then((foundUser) => {
      if (!foundUser) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('properties')
          .where({ owner: username, id: id })
          .first()
          .then((property) => {
            if (!property) {
              console.log("There are no property with the given username.")
              return reject(utils.respondWithCode(404))
            } else {
              console.log("Property found.")
              return resolve(utils.respondWithCode(200, property))
            }
          })
          .catch((error) => {
            console.error(error)
            return reject(utils.respondWithCode(500))
          })
      }
    })
  })
}


/**
 * Add a property for the user with the given username.
 *
 * body Property New property object.
 * username String Username of the user.
 * returns Property
 **/
exports.postUserProperty = function (body, username) {
  return new Promise(function (resolve, reject) {
    console.log("Adding new property to the database...");

    const book = body['book'];
    const position = body['position'];
    const user = username;
    const bookId = book['bookId'];
    const province = position['province'].toLowerCase();
    const town = position['town'].toLowerCase();

    if (!user || !bookId || !town || !province) {
      console.error("Property not added: not nullable field is empty.")
      return reject(utils.respondWithCode(400))
    }

    // Check if the property is already stored.
    return userService.findUser(username).then((foundUser) => {
      if (!foundUser) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('properties')
          .where({ owner: user, bookId: bookId, town: town, province: province })
          .first()
          .then((property) => {
            if (property) {
              console.error("The property is already inside the database.")
              return reject(utils.respondWithCode(409))
            } else {
              return sqlDb('properties').insert({
                owner: user,
                bookId: bookId,
                town: town,
                province: province
              }).then(() => {
                console.log(`Property successfully added to the database.`)
                return sqlDb('properties')
                  .where({
                    owner: user,
                    bookId: bookId,
                    town: town,
                    province: province
                  })
                  .first()
                  .then((property) => {
                    return resolve(utils.respondWithCode(201, property))
                  })
              }).catch((error) => {
                console.error("ERROR: " + error)
                return reject(utils.respondWithCode(500))
              });
            }
          })
      }
    })
  })
}


/**
 * Get all the properties in a given town.
 *
 * province String The name of the province where the town of interest is placed.
 * town String The name of the town of interest.
 * returns List
 **/
exports.getPropertiesByTown = function (province, town) {
  return new Promise(function (resolve, reject) {

    console.log("Retrieving properties in province: " + province + ", town: " + town + "...");

    if (!province || !town) {
      console.error("Province and town cannot be null.");
      return reject(utils.respondWithCode(400))
    }

    province = province.toLowerCase();
    town = town.toLowerCase();

    return sqlDb('properties').where({ province: province, town: town })
      .then(properties => {
          console.log("Returning properties.");
          return resolve(utils.respondWithCode(200, properties));
      })
      .catch(error => {
        console.error(error);
        return reject(utils.respondWithCode(500));
      })
  });
}

/**
 * Get all the properties in a given province.
 *
 * province String The name of the province of interest.
 * returns List
 **/
exports.getPropertiesByProvince = function (province) {
  return new Promise(function (resolve, reject) {
    console.log("Retrieving properties in province: " + province + "...");

    if (!province) {
      console.error("Province cannot be null.");
      return reject(utils.respondWithCode(400))
    }

    province = province.toLowerCase();

    return sqlDb('properties').where({ province: province })
      .then(properties => {
          console.log("Returning properties.");
          return resolve(utils.respondWithCode(200, properties));
      })
      .catch(error => {
        console.error(error);
        return reject(utils.respondWithCode(500));
      })
  });
}