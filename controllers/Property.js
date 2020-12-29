'use strict';

var utils = require('../utils/writer.js');
var Property = require('../service/PropertyService');

module.exports.deleteUserProperty = function deleteUserProperty (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Property.deleteUserProperty(username,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserProperties = function getUserProperties (req, res, next) {
  var username = req.swagger.params['username'].value;
  Property.getUserProperties(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserProperty = function getUserProperty (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Property.getUserProperty(username,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postUserProperty = function postUserProperty (req, res, next) {
  var book = req.swagger.params['book'].value;
  var username = req.swagger.params['username'].value;
  Property.postUserProperty(book,username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
