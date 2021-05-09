'use strict';

const status = {
  PROPOSED: 'proposed',
  REFUSED: 'refused',
  AGREED: 'agreed',
  HAPPENED: 'happened'
}

let sqlDb;
var utils = require('../utils/writer.js');
var userService = require("./UserService.js");

exports.archivedExchangesDbSetup = function (connection) {
  sqlDb = connection;
  return sqlDb.schema.hasTable('archivedexchanges').then(exists => {
    if (!exists) return initArchivedExchangesTable()
    else console.log("Table 'archivedexchanges' already exists.")
  })
}

function initArchivedExchangesTable() {
  console.log("Table 'archivedexchanges' does not exist. Creating it...");
  let archivedExchangesTable = sqlDb.schema.createTable('archivedexchanges', table => {
    table.increments('id').primary();
    table.string('buyer').notNullable();
    table.string('seller').notNullable();
    table.string('propertyBookId').notNullable();
    table.string('status').defaultTo(status.REFUSED);
    table.string('paymentBookId');
    table.foreign('buyer').references('users.username').onDelete('CASCADE');
    table.foreign('seller').references('users.username').onDelete('CASCADE');
  });
  console.log("Table 'archivedexchanges' created.");
  return archivedExchangesTable;
}

/**
 * Get all the archived exchanges where the user were a buyer.
 *
 * buyerUsername String Username of the buyer whose archived exchanges have to be obtained.
 * returns List
 **/
exports.getArchivedUserExchangesBuyer = async (buyerUsername) => {

  try {
    console.log(`Retrieving all archived exchanges of buyer ${buyerUsername}.`);

    let user = await userService.findUser(buyerUsername);

    if (!user) {
      console.log(`There are no user with username ${buyerUsername}.`);
      return utils.respondWithCode(404);
    }

    let exchanges = await sqlDb('archivedexchanges')
      .where({ buyer: buyerUsername });

    console.log(`Archived exchanges of buyer ${buyerUsername} retrieved.`);
    return utils.respondWithCode(200, { "items" : exchanges });

  } catch (error) {
    console.error(error);
    return utils.respondWithCode(500);
  }
}


/**
 * Get all the archived exchanges where the user were a seller.
 *
 * sellerUsername String Username of the seller whose archived exchanges have to be obtained.
 * returns List
 **/
exports.getArchivedUserExchangesSeller = async (sellerUsername) => {

  try {
    console.log(`Retrieving all archived exchanges of seller ${sellerUsername}.`);

    let user = await userService.findUser(sellerUsername);

    if (!user) {
      console.log(`There are no user with username ${sellerUsername}.`);
      return utils.respondWithCode(404);
    }

    let exchanges = await sqlDb('archivedexchanges')
      .where({ seller: sellerUsername });

    console.log(`Archived exchanges of seller ${sellerUsername} retrieved.`);
    return utils.respondWithCode(200, { "items" : exchanges });

  } catch (error) {
    console.error(error);
    return utils.respondWithCode(500);
  }
}

