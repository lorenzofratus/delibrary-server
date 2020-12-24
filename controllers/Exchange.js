'use strict';

var utils = require('../utils/writer.js');
var Exchange = require('../service/ExchangeService');

module.exports.deleteExchange = function deleteExchange (req, res, next) {
  var id = req.swagger.params['id'].value;
  Exchange.deleteExchange(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getExchange = function getExchange (req, res, next) {
  var id = req.swagger.params['id'].value;
  Exchange.getExchange(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserExchanges = function getUserExchanges (req, res, next) {
  var username = req.swagger.params['username'].value;
  Exchange.getUserExchanges(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateExchange = function updateExchange (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  Exchange.updateExchange(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
