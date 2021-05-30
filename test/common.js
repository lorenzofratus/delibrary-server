'use strict';

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

const user_test = {
    surname: "Sala",
    name: "Nicolò",
    email: "nicolo.sala@domain.org",
    username: "nicheosala_test",
    password: "VeryStrongPassword"
};

let property_test = {
    id: undefined,
    owner: user_test.username,
    bookId: "MNOPWJTvuxoC",
    province: "Lecco",
    town: "Osnago"
}

let wish_test = {
    id: undefined,
    user: user_test.username,
    bookId: "Gagagagagagag"
};

const book_and_position = {
    book: { bookId: property_test.bookId },
    position: {town: property_test.town, province: property_test.province }
};

exports.book_and_position = book_and_position;
exports.user_test = user_test;
exports.property_test = property_test;
exports.wish_test = wish_test;
exports.chai = chai;
exports.server = require("../index");
