'use strict';

var utils = require('../utils/writer.js');
var Exchange = require('../service/ExchangeService');

module.exports.agreeExchange = function agreeExchange(req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Exchange.agreeExchange(id, body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteUserExchange = function deleteUserExchange(req, res, next) {
  var id = req.swagger.params['id'].value;
  Exchange.deleteUserExchange(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserExchanges = function getUserExchanges(req, res, next) {
  var username = req.swagger.params['username'].value;
  Exchange.getUserExchanges(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserExchangesBuyer = function getUserExchangesBuyer(req, res, next) {
  var buyerUsername = req.swagger.params['buyerUsername'].value;
  Exchange.getUserExchangesBuyer(buyerUsername)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserExchangesSeller = function getUserExchangesSeller(req, res, next) {
  var sellerUsername = req.swagger.params['sellerUsername'].value;
  Exchange.getUserExchangesSeller(sellerUsername)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.happenedExchange = function happenedExchange(req, res, next) {
  var id = req.swagger.params['id'].value;
  Exchange.happenedExchange(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postUserExchange = function postUserExchange(req, res, next) {
  var body = req.swagger.params['body'].value;
  var buyerUsername = req.swagger.params['buyerUsername'].value;
  Exchange.postUserExchange(body, buyerUsername)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.refuseExchange = function refuseExchange(req, res, next) {
  var id = req.swagger.params['id'].value;
  Exchange.refuseExchange(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};