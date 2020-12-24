'use strict';


/**
 * Delete the exchange with the given ID.
 * This can only be done by the logged in user.
 *
 * id Long ID of the exchange to delete.
 * no response value expected for this operation
 **/
exports.deleteExchange = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Get the exchange with the given ID.
 *
 * id Long ID of the exchange to get.
 * returns Exchange
 **/
exports.getExchange = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "proposingUser" : {
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
  },
  "respondingUser" : {
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
  },
  "id" : 0,
  "proposedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "respondedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "status" : "proposed"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get all the exchanges in which the user with the given username is involved.
 *
 * username String Username of the user whose exchanges are to be obtained.
 * returns List
 **/
exports.getUserExchanges = function(username) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "proposingUser" : {
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
  },
  "respondingUser" : {
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
  },
  "id" : 0,
  "proposedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "respondedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "status" : "proposed"
}, {
  "proposingUser" : {
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
  },
  "respondingUser" : {
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
  },
  "id" : 0,
  "proposedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "respondedBook" : {
    "ISBN" : "1280229045",
    "position" : {
      "province" : "Lecco",
      "city" : "Brivio",
      "region" : "Lombardia"
    },
    "status" : "have"
  },
  "status" : "proposed"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update the exchange with the given ID.
 * This can only be done by the logged in user.
 *
 * id Long ID of the exchange to update.
 * body Exchange Updated version of the exchange object.
 * no response value expected for this operation
 **/
exports.updateExchange = function(id,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

