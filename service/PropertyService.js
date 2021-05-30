'use strict';

let sqlDb;
var utils = require('../utils/writer.js');
const { archiveExchangesContaining } = require('./ExchangeService.js');
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
    table.string('province').notNullable();
    table.boolean('isInAgreedExchange').notNullable().defaultTo(false);
  });
  console.log("Table 'properties' created.");
  return properties;
}

exports.deleteUserProperty = async (username, id) => {

  try {

    console.log(`Deleting property ${id} from the database...`)
    let property = await sqlDb('properties').where({ id: id }).first();

    if (!property) {
      console.error(`No property found with id ${id}`);
      return utils.respondWithCode(404);
    }

    await archiveExchangesContaining(id);

    await sqlDb('properties')
      .where({ id: id })
      .del();

    console.log(`Property ${id} successfully deleted from the database.`);
    return utils.respondWithCode(200);
  } catch (error) {
    console.error(error);
    return utils.respondWithCode(500);
  }
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
exports.postUserProperty = async (body, username) => {

  try {
    const book = body['book'];
    const position = body['position'];

    if (!book || !position || !username)
      return utils.respondWithCode(400);

    const bookId = book['bookId'];
    let province = position['province'];
    let town = position['town'];

    if (!bookId || !town || !province)
      return utils.respondWithCode(400);

    province = province.toLowerCase();
    town = town.toLowerCase();

    if (!(await userService.findUser(username)))
      return utils.respondWithCode(404);

    if (await sqlDb('wishes').where({ user: username, bookId: bookId }).first()) {
      console.error("The book is currently a wish of the user, so it has not been added as a property.");
      return utils.respondWithCode(406);
    }

    if (await sqlDb('properties').where({ owner: username, bookId: bookId, town: town, province: province }).first()) {
      console.error("The property is already inside the database.");
      return utils.respondWithCode(409);
    }

    const [property] = await sqlDb('properties').insert({
      owner: username,
      bookId: bookId,
      town: town,
      province: province
    }, '*');

    return utils.respondWithCode(201, property);
  } catch (error) {
    return utils.respondWithCode(500);
  }
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

/**
 * Modify the position of a property.
 *
 * id Long ID of the property.
 * body Body (required)
 * returns Property
 **/
exports.modifyPropertyPosition = async (id, body) => {

  try {
    console.log(`Modifying position of property ${id}...`);

    const property = await sqlDb('properties').where({ id: id }).first();
    if (!property) {
      console.error(`No property found with id ${id}.`);
      return utils.respondWithCode(404);
    }

    const newProvince = body['newProvince'];
    const newTown = body['newTown'];
    
    if (!newProvince || !newTown) {
      console.error(`No new province or new town specified.`);
      return utils.respondWithCode(400);
    }

    const [updatedProperty] = await sqlDb('properties').where({ id: id }).update({
      province: newProvince,
      town: newTown
    }, '*');

    console.log(`Position of property ${id} successfully updated.`);
    return utils.respondWithCode(201, updatedProperty);
  } catch (error) {
    console.log(error);
    return utils.respondWithCode(500);
  }
}