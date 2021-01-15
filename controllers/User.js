'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.addUser = function addUser (req, res, next) {
  var body = req.swagger.params['body'].value;
  User.addUser(body)
    .then(function (response) {
      req.session.user = response.payload;
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  User.deleteUser(req.session.user, username)
    .then(function (response) {
      req.session.destroy();
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserByUsername = function getUserByUsername (req, res, next) {
  var username = req.swagger.params['username'].value;
  User.getUserByUsername(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUsers = function getUsers (req, res, next) {
  User.getUsers()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.loginUser = function loginUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  var password = req.swagger.params['password'].value;
  User.loginUser(username,password)
    .then(function (response) {
      req.session.user = response.payload;
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.validateUser = function validateUser (req, res, next) {
  var user = req.session.user;
  User.validateUser(user)
    .then(function (response) {
      req.session.user = response.payload;
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.logoutUser = function logoutUser (req, res, next) {
  User.logoutUser()
    .then(function (response) {
      req.session.destroy();
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateUser = function updateUser (req, res, next) {
  var username = req.swagger.params['username'].value;
  var body = req.swagger.params['body'].value;
  User.updateUser(req.session.user,username,body)
    .then(function (response) {
      req.session.user = response.payload;
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
