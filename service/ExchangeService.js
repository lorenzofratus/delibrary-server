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
    table.integer('book').notNullable();
    table.string("status").defaultTo(status.PROPOSED);
    table.integer("payment");
    table.foreign('buyer').references('users.username').onDelete('CASCADE');
    table.foreign('seller').references('users.username').onDelete('CASCADE');
  });
  console.log("Table 'exchanges' created.");
  return exchanges;
}


/**
 * Delete the exchange of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the exchange.
 * no response value expected for this operation
 **/
exports.deleteUserExchange = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Deleting exchange from the database...")

    return userService.findUser(username).then((user) => {
      if (!user) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('exchanges')
          .where({ buyer: username, id: id })
          .del()
          .then(() => {
            console.log("Exchange " + id + " successfully deleted from the database.")
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
 * Get the exchange of the user with the given ID.
 *
 * username String Username of the user.
 * id Long ID of the exchange.
 * returns Exchange
 **/
exports.getUserExchange = function (username, id) {
  return new Promise(function (resolve, reject) {
    console.log("Looking for exchange " + id)

    return userService.findUser(username).then((user) => {
      if (!user) {
        console.error("No users with the given username")
        return reject(utils.respondWithCode(404))
      } else {
        return sqlDb('exchanges')
          .where({ buyer: username, id: id })
          .first()
          .then((exchange) => {
            if (!exchange) {
              console.log("There are no exchange with the given username and id.")
              return reject(utils.respondWithCode(404))
            } else {
              console.log("Exchange found.")
              return resolve(utils.respondWithCode(200, exchange))
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
            return resolve(utils.respondWithCode(200, exchanges))
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

    // TODO check that the operation is authorized

    const sellerUsername = body['sellerUsername'];
    const bookId = body['bookId'];

    console.log("buyerUsername: " + buyerUsername)
    console.log("BookID: " + bookId)
    console.log("SellerUsername: " + sellerUsername)
    if (!buyerUsername || bookId < 0 || !sellerUsername) {
      console.error("Exchange not added: not nullable field is empty.")
      return reject(utils.respondWithCode(400))
    }

    if (buyerUsername === sellerUsername) {
      console.error("Exchange not added: buyer and seller usernames cannot be the same.")
      return reject(utils.respondWithCode(400))
    }

    return sqlDb('properties')
      .where({owner: buyerUsername, bookId: bookId})
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
                .where({ buyer: buyerUsername, seller: sellerUsername, book: bookId })
                .first()
                .then((exchange) => {
                  if (exchange) {
                    console.error("There's already a exchange with for the given bookId and seller and buyer.")
                    return reject(utils.respondWithCode(409))
                  } else {
                    return sqlDb('exchanges').insert({
                      buyer: buyerUsername,
                      seller: sellerUsername,
                      book: bookId
                    }).then(() => {
                      console.log(`Exchange successfully added to the database.`)
                      return sqlDb('exchanges')
                        .where({ buyer: buyerUsername, book: bookId })
                        .first()
                        .then((exchange) => {
                          return resolve(utils.respondWithCode(201, exchange))
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

exports.agreeExchange = function agreeExchange(sellerUsername, exchangeId, book) {
  return new Promise(function (resolve, reject) {
    // 1. TODO Authorization management (403): check that the seller is the one performing this update. Maybe you have to slightly change the API.
    // 2. Extract the exchange with the given ID: if there are no valid exchanges for the given ID, return 404.
    // 3. Otherwise, update the status to status.AGREED
    // 4. Return the updated exchange (return 201)
    console.log("Updating an exchange inside the database...")

    if (exchangeId < 0 || !sellerUsername || !book) {
      console.error("Non-nullable field is empty.");
      return reject(utils.respondWithCode(400))
    }

    return sqlDb('properties')
      .where({owner: sellerUsername, bookId: book})
      .first()
      .then((property) => {
        if (!property) {
          console.error("The specified property does not belong to the specified seller.")
          return reject(utils.respondWithCode(400))
        } else {
          return sqlDb('exchanges')
            .where({ seller: sellerUsername, id: exchangeId })
            .first()
            .then((exchange) => {
              if (!exchange) {
                console.log("Exchange not found.")
                return reject(utils.respondWithCode(404));
              } else if (exchange['status'] !== status.PROPOSED) {
                console.log("You cannot modify the state of an exchange from " + exchange['status'] + " to 'agreed'.")
                return reject(utils.respondWithCode(400));
              } else {
                return sqlDb('exchanges')
                  .where({ seller: sellerUsername, id: exchange })
                  .first()
                  .update({ status: status.AGREED })
                  .then(() => {
                    return sqlDb('exchanges')
                      .where({ seller: sellerUsername, id: exchangeId })
                      .first()
                      .then((updatedExchange) => {
                        console.log("Exchange successfully updated.")
                        return resolve(utils.respondWithCode(201, updatedExchange))
                      }).catch((error) => {
                        console.error(error)
                        return reject(utils.respondWithCode(500))
                      })
                  }).catch((error) => {
                    console.error(error)
                    return reject(utils.respondWithCode(500))
                  })
              }
            })
        }
      })
  })
}

exports.happenedExchange = function happenedExchange(username, exchangeId) {
  return new Promise(function (resolve, reject) {
    // 1. TODO Authorization management (403): check that the seller is the one performing this update. Maybe you have to slightly change the API.
    // 2. Extract the exchange with the given ID: if there are no valid exchanges for the given ID, return 404.
    // 3. Otherwise, update the status to status.AGREED
    // 4. Return the updated exchange (return 201)
    console.log("Updating an exchange inside the database...")

    return sqlDb('exchanges')
      .where({ buyer: username, id: exchangeId })
      .orWhere({ seller: username, id: exchangeId })
      .first()
      .then((exchange) => {
        if (!exchange) {
          console.log("Exchange not found.")
          return reject(utils.respondWithCode(404));
        } else if (exchange['status'] !== status.AGREED) {
          console.log("You cannot modify the state of an exchange from " + exchange['status'] + " to 'happened'.")
          return reject(utils.respondWithCode(400));
        } else {
          return sqlDb('exchanges')
            .where({ id: exchangeId })
            .first()
            .update({ status: status.HAPPENED })
            .then(() => {
              return sqlDb('exchanges')
                .where({ id: exchangeId })
                .first()
                .then((updatedExchange) => {
                  console.log("Exchange successfully updated.")
                  return resolve(utils.respondWithCode(201, updatedExchange))
                }).catch((error) => {
                  console.error(error)
                  return reject(utils.respondWithCode(500))
                })
            }).catch((error) => {
              console.error(error)
              return reject(utils.respondWithCode(500))
            })
        }
      })
  })
}

exports.refuseExchange = function refuseExchange(sellerUsername, exchangeId) {
  return new Promise(function (resolve, reject) {
    // 1. TODO Authorization management (403): check that the seller is the one performing this update. Maybe you have to slightly change the API.
    // 2. Extract the exchange with the given ID: if there are no valid exchanges for the given ID, return 404.
    // 3. Otherwise, update the status to status.AGREED
    // 4. Return the updated exchange (return 201)
    console.log("Updating an exchange inside the database...")

    return sqlDb('exchanges')
      .where({ seller: sellerUsername, id: exchangeId })
      .first()
      .then((exchange) => {
        if (!exchange) {
          console.log("Exchange not found.")
          return reject(utils.respondWithCode(404));
        } else if (exchange['status'] !== status.PROPOSED) {
          console.log("You cannot modify the state of an exchange from " + exchange['status'] + " to 'refused'.")
          return reject(utils.respondWithCode(400));
        } else {
          return sqlDb('exchanges')
            .where({ seller: sellerUsername, id: exchangeId })
            .first()
            .update({ status: status.REFUSED })
            .then(() => {
              return sqlDb('exchanges')
                .where({ seller: sellerUsername, id: exchangeId })
                .first()
                .then((updatedExchange) => {
                  console.log("Exchange successfully updated.")
                  return resolve(utils.respondWithCode(201, updatedExchange))
                }).catch((error) => {
                  console.error(error)
                  return reject(utils.respondWithCode(500))
                })
            }).catch((error) => {
              console.error(error)
              return reject(utils.respondWithCode(500))
            })
        }
      })
  })
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
            return resolve(utils.respondWithCode(200, exchanges))
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
            return resolve(utils.respondWithCode(200, exchanges))
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