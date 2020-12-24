'use strict';


/**
 * Add a new user to Delibrary.
 *
 * body User New user object.
 * no response value expected for this operation
 **/
exports.addUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get the user with the given username.
 *
 * username String Username of the user to get.
 * returns User
 **/
exports.getUserByUsername = function(username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "library" : [ {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  }, {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  } ],
  "surname" : "Sala",
  "wishlist" : [ {
    "ISBN" : "9780491212489"
  }, {
    "ISBN" : "9780491212489"
  } ],
  "name" : "Nicolò",
  "email" : "example@domain.org",
  "username" : "nicheosala"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get all Delibrary users.
 *
 * returns List
 **/
exports.getUsers = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "library" : [ {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  }, {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  } ],
  "surname" : "Sala",
  "wishlist" : [ {
    "ISBN" : "9780491212489"
  }, {
    "ISBN" : "9780491212489"
  } ],
  "name" : "Nicolò",
  "email" : "example@domain.org",
  "username" : "nicheosala"
}, {
  "library" : [ {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  }, {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  } ],
  "surname" : "Sala",
  "wishlist" : [ {
    "ISBN" : "9780491212489"
  }, {
    "ISBN" : "9780491212489"
  } ],
  "name" : "Nicolò",
  "email" : "example@domain.org",
  "username" : "nicheosala"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Logs the user into the system.
 *
 * username String Username for login.
 * password String Password for login IN CLEAR TEXT.
 * no response value expected for this operation
 **/
exports.loginUser = function(username,password) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Logs out current logged in user session.
 * This can only be done by the logged in user.
 *
 * no response value expected for this operation
 **/
exports.logoutUser = function() {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Update the user with the given username.
 * This can only be done by the logged in user.
 *
 * username String Username of the user to update.
 * body User Updated version of the user object.
 * no response value expected for this operation
 **/
exports.updateUser = function(username,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

