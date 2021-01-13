'use strict';

var utils = require('../utils/writer.js');
var Wish = require('../service/WishService');

module.exports.deleteUserWish = function deleteUserWish (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Wish.deleteUserWish(username,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserWish = function getUserWish (req, res, next) {
  var username = req.swagger.params['username'].value;
  var id = req.swagger.params['id'].value;
  Wish.getUserWish(username,id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getUserWishes = function getUserWishes (req, res, next) {
  var username = req.swagger.params['username'].value;
  Wish.getUserWishes(username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postUserWish = function postUserWish (req, res, next) {
  var book = req.swagger.params['Book'].value;
  var username = req.swagger.params['username'].value;
  Wish.postUserWish(book,username)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};