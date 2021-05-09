'use strict';

var utils = require('../utils/writer.js');
var ArchivedExchange = require('../service/ArchivedExchangeService');

module.exports.getArchivedUserExchangesBuyer = function getArchivedUserExchangesBuyer (req, res, next) {
  var buyerUsername = req.swagger.params['buyerUsername'].value;
  ArchivedExchange.getArchivedUserExchangesBuyer(buyerUsername)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getArchivedUserExchangesSeller = function getArchivedUserExchangesSeller (req, res, next) {
  var sellerUsername = req.swagger.params['sellerUsername'].value;
  ArchivedExchange.getArchivedUserExchangesSeller(sellerUsername)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
