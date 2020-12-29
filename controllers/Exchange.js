'use strict';

var utils = require('../utils/writer.js');
var Exchange = require('../service/ExchangeService');

module.exports.deleteUserExchange = function deleteUserExchange (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Exchange.deleteUserExchange(username,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserExchange = function getUserExchange (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Exchange.getUserExchange(username,id)
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

module.exports.postUserExchange = function postUserExchange (req, res, next) {
  var body = req.swagger.params['body'].value;
  var username = req.swagger.params['username'].value;
  Exchange.postUserExchange(body,username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
