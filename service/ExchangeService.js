'use strict';

let sqlDb;
var utils = require('../utils/writer.js');
var userService = require("./UserService.js");

const status = {
  PROPOSED: 'proposed',
  REFUSED: 'refused',
  AGREED: 'agreed',
  HAPPENED: 'happened'
}

exports.exchangesDbSetup = function (connection) {
  sqlDb = connection;
  return sqlDb.schema.hasTable('exchanges').then(exists => {
    if (!exists) return initExchangesTable()
    else console.log("Table 'exchanges' already exists.")
  })
}

function initExchangesTable() {
  console.log("Table 'exchanges' does not exist. Creating it...");
  var exchanges = sqlDb.schema.createTable("exchanges", table => {
    table.increments('id').primary();
    table.string('buyer').notNullable();
    table.string('seller').notNullable();
    table.integer('property').notNullable();
    table.string("status").defaultTo(status.PROPOSED);
    table.integer("payment");
    table.foreign('buyer').references('users.username').onDelete('CASCADE');
    table.foreign('seller').references('users.username').onDelete('CASCADE');
  });
  console.log("Table 'exchanges' created.");
  return exchanges;
}

/**
 * Set the flag 'isInAgreedExchange' of the Property associated
 * to the given propertyId to true.
 */
function putPropertyInAgreedState(propertyId) {
  return sqlDb('properties')
    .where({ id: propertyId })
    .update({ isInAgreedExchange: true })
}

/**
 * Set the flag 'isInAgreedExchange' of the Property associated
 * to the given propertyId to false.
 */
function removePropertyFromAgreedState(propertyId) {
  return sqlDb('properties')
    .where({ id: propertyId })
    .update({ isInAgreedExchange: false })
}

/**
 * Archive all the Exchanges containing the Property with the given propertyId.
 */
exports.archiveExchangesContaining = async (propertyId) => {

  let exchangesToBeArchived = await sqlDb('exchanges')
    .where({ property: propertyId })
    .orWhere({ payment: propertyId });

  console.log(exchangesToBeArchived)

  for (let exchange of exchangesToBeArchived) {
    console.log(exchange)
    archive(exchange)
  }
}

/**
 * Archive the given Exchange.
 * 'Archive an Exchange' means:
 * 1. insert a new tuple archivedExchange table 'archivedexchanges'.
 *  The status of this new Exchange is HAPPENED, if the status of the corresponding
 *  Exchange is HAPPENED. Otherwise, it is REFUSED.
 * 2. remove the Exchange from table 'exchanges'
 */
async function archive(exchange, new_status = status.REFUSED) {

  let [{ bookId: propertyBookId }] = await sqlDb('properties')
    .select('bookId')
    .where({ id: exchange['property'] });

  let paymentBookId;
  if (!exchange['payment']) paymentBookId = null;
  else [{ bookId: paymentBookId }] = await sqlDb('properties')
      .select('bookId')
      .where({ id: exchange['payment'] });

  let [archivedExchange] = await sqlDb('archivedexchanges').insert({
    buyer: exchange['buyer'],
    seller: exchange['seller'],
    propertyBookId: propertyBookId,
    paymentBookId: paymentBookId,
    status: new_status
  }, '*')

  await sqlDb('exchanges')
    .where({ id: exchange['id'] })
    .del();

  return archivedExchange
}

async function get_final_exchange(exchange) {

  let property = await sqlDb('properties').where({ id: exchange.property }).first()
  let payment = await sqlDb('properties').where({ id: exchange.payment }).first()

  let buyer = await sqlDb('users').where({ username: exchange.buyer }).first()
  let seller = await sqlDb('users').where({ username: exchange.seller }).first()

  return {
    id: exchange.id,
    buyer: userService.hidePassword(buyer),
    seller: userService.hidePassword(seller),
    property: property,
    payment: payment,
    status: exchange.status
  }
}

function get_final_exchanges(exchanges) {
  let final_exchanges = [];
  for (let exchange of exchanges) {
    final_exchanges.push(get_final_exchange(exchange));
  }
  return Promise.all(final_exchanges);
}

/**
 * Delete the exchange of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the exchange.
 * no response value expected for this operation
 **/
exports.deleteUserExchange = async (id) => {
  try {
    console.log(`Deleting exchange ${id} from the database...`)

    let exchange = await sqlDb('exchanges').where({ id: id }).first()
    if (!exchange) {
      console.error(`No exchange found with id ${id}.`)
      return utils.respondWithCode(404)
    }

    let [{ property: propertyId, payment: paymentId }] =
      await sqlDb('exchanges')
        .where({ id: id })
        .returning(['property', 'payment'])
        .del()

    if (propertyId) await sqlDb('properties')
      .where({ id: propertyId })
      .update({ isInAgreedExchange: false })

    if (paymentId) await sqlDb('properties')
      .where({ id: paymentId })
      .update({ isInAgreedExchange: false })

    console.log(`Exchange ${id} successfully deleted from the database.`)
    return utils.respondWithCode(200)
  } catch (error) {
    console.error(error)
    return utils.respondWithCode(500)
  }
}

/**
 * Get all the exchanges where the user is involved.
 *
 * username String Username of the user whose exchanges have to be obtained.
 * returns List
 **/
exports.getUserExchanges = function (username) {
  return new Promise(function (resolve, reject) {
    console.log("Returning all the exchanges of " + username + ".")
    return userService.findUser(username).then((user) => {
      if (!user) {
        console.log("There are no user with the given username.")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('exchanges')
          .where({ buyer: username })
          .orWhere({ seller: username })
          .then((exchanges) => {
            return get_final_exchanges(exchanges)
              .then((final_exchanges) => {
                console.log("Returning exchanges");
                return resolve(utils.respondWithCode(200, final_exchanges));
              })

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
 * Add a exchange for the user with the given username.
 *
 * body Exchange New exchange object.
 * username String Username of the user.
 * returns Exchange
 **/
exports.postUserExchange = function (body, buyerUsername) {
  return new Promise(function (resolve, reject) {
    console.log("Adding new exchange to the database...");

    const sellerUsername = body['sellerUsername'];
    const propertyId = body['propertyId'];

    console.log("buyerUsername: " + buyerUsername)
    console.log("PropertyId: " + propertyId)
    console.log("SellerUsername: " + sellerUsername)
    if (!buyerUsername || propertyId < 0 || !sellerUsername) {
      console.error("Exchange not added: not nullable field is empty.")
      return reject(utils.respondWithCode(400))
    }

    if (buyerUsername === sellerUsername) {
      console.error("Exchange not added: buyer and seller usernames cannot be the same.")
      return reject(utils.respondWithCode(400))
    }

    return sqlDb('properties')
      .where({ owner: sellerUsername, id: propertyId })
      .first()
      .then((property) => {
        if (!property) {
          console.error("The specified property does not belong to the specified seller.")
          return reject(utils.respondWithCode(400))
        } else {
          // Check if the exchange is already stored.
          return userService.findUser(buyerUsername).then((userFound) => {
            if (!userFound) {
              console.error("No users with the given username")
              return reject(utils.respondWithCode(404))
            } else {
              return sqlDb('exchanges')
                .where({ buyer: buyerUsername, seller: sellerUsername, property: propertyId })
                .first()
                .then((exchange) => {
                  if (exchange) {
                    console.error("There's already a exchange with for the given propertyId and seller and buyer.")
                    return reject(utils.respondWithCode(409))
                  } else {
                    return sqlDb('exchanges').insert({
                      buyer: buyerUsername,
                      seller: sellerUsername,
                      property: propertyId
                    }).then(() => {
                      console.log(`Exchange successfully added to the database.`)
                      return sqlDb('exchanges')
                        .where({ buyer: buyerUsername, property: propertyId })
                        .first()
                        .then((exchange) => {
                          return get_final_exchange(exchange)
                            .then((final_exchange) => {
                              return resolve(utils.respondWithCode(201, final_exchange));
                            })
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
        }
      })
  })
}

exports.agreeExchange = async (id, body) => {

  try {
    console.log(`Setting exchange ${id} as agreed into the database...`)

    let exchange = await sqlDb('exchanges').where({ id: id }).first()
    if (!exchange) {
      console.error(`No exchange found with id ${id}.`)
      return utils.respondWithCode(404)
    }

    let paymentId = body['paymentId']
    let payment = await sqlDb('properties').where({ id: paymentId }).first()
    if (!payment) {
      console.error(`No payment found with id ${paymentId}.`)
      return utils.respondWithCode(404)
    }

    if (payment['owner'] !== exchange['buyer']) {
      console.error(`The exchange buyer is not the owner of the payment property.`)
      return utils.respondWithCode(400)
    }

    if (exchange['status'] !== status.PROPOSED) {
      console.log(`You cannot modify the state of an exchange from ${exchange['status']} to 'agreed'.`)
      return utils.respondWithCode(400);
    }

    await sqlDb('exchanges')
      .where({ id: id })
      .update({ status: status.AGREED, payment: paymentId })

    let updated_exchange = await sqlDb('exchanges').where({ id: id }).first()

    await putPropertyInAgreedState(updated_exchange['property'])
    await putPropertyInAgreedState(updated_exchange['payment'])

    console.log(`Exchange ${id} successfully updated as agreed.`)
    return utils.respondWithCode(201, updated_exchange)
  } catch (error) {
    console.error(error)
    return utils.respondWithCode(500)
  }
}

exports.happenedExchange = async (id) => {

  try {
    console.log(`Setting exchange ${id} as happened into the database...`)

    let exchange = await sqlDb('exchanges').where({ id: id }).first()
    if (!exchange) {
      console.error(`No exchange found with id ${id}.`)
      return utils.respondWithCode(404)
    }

    if (exchange['status'] !== status.AGREED) {
      console.log(`You cannot modify the state of an exchange from ${exchange['status']} to 'happened'.`)
      return utils.respondWithCode(400);
    }

    let property = await sqlDb('properties').where({ id: exchange['property'] }).first()
    let payment = await sqlDb('properties').where({ id: exchange['payment'] }).first()

    await sqlDb('properties').where({ id: property['id'] }).update({
      owner: payment['owner'],
      town: payment['town'],
      province: payment['province'],
      isInAgreedExchange: false
    })

    await sqlDb('properties').where({ id: payment['id'] }).update({
      owner: property['owner'],
      town: property['town'],
      province: property['province'],
      isInAgreedExchange: false
    })

    let archivedExchange = await archive(exchange, status.HAPPENED);

    console.log(`Exchange successfully updated.`)
    return utils.respondWithCode(201, archivedExchange)
  } catch (error) {
    console.error(error)
    return utils.respondWithCode(500)
  }
}

exports.refuseExchange = async (id) => {
  try {
    console.log(`Setting exchange ${id} as refused into the database...`)

    let exchange = await sqlDb('exchanges').where({ id: id }).first()
    if (!exchange) {
      console.error(`No exchange found with id ${id}.`)
      return utils.respondWithCode(404)
    }

    if (exchange['status'] !== status.AGREED && exchange['status'] !== status.PROPOSED) {
      console.log(`You cannot modify the state of an exchange from 'happened' to 'refused'.`)
      return utils.respondWithCode(400);
    }

    await removePropertyFromAgreedState(exchange['property'])
    if (exchange['payment']) await removePropertyFromAgreedState(exchange['payment'])

    let archivedExchange = await archive(exchange);

    console.log(`Exchange successfully updated as refused.`)
    return utils.respondWithCode(201, archivedExchange)

  } catch (error) {
    console.error(error)
    return utils.respondWithCode(500)
  }
}

exports.getUserExchangesSeller = function getUserExchangesSeller(sellerUsername) {
  return new Promise(function (resolve, reject) {
    console.log("Returning all the exchanges where " + sellerUsername + "is a seller.")
    return userService.findUser(sellerUsername).then((user) => {
      if (!user) {
        console.log("There are no user with the given username.")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('exchanges')
          .where({ seller: sellerUsername })
          .then((exchanges) => {
            return get_final_exchanges(exchanges)
              .then((final_exchanges) => {
                console.log("Exchanges of user as seller returned.");
                return resolve(utils.respondWithCode(200, final_exchanges));
              })

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

exports.getUserExchangesBuyer = function getUserExchangesBuyer(buyerUsername) {
  return new Promise(function (resolve, reject) {
    console.log("Returning all the exchanges where " + buyerUsername + "is a buyer.")
    return userService.findUser(buyerUsername).then((user) => {
      if (!user) {
        console.log("There are no user with the given username.")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('exchanges')
          .where({ buyer: buyerUsername })
          .then((exchanges) => {
            return get_final_exchanges(exchanges)
              .then((final_exchanges) => {
                console.log("Exchanges of user as buyer returned.");
                return resolve(utils.respondWithCode(200, final_exchanges));
              })
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