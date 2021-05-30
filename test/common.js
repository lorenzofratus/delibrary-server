const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const bookId_test = "MNOPWJTvuxoC";
const username_test = "nicheosala_test";
const password_test = "veryStrongPassword";

chai.use(chaiHttp);

exports.chai = chai;
exports.server = require("../index");
exports.username_test = username_test;
exports.password_test = password_test;
exports.bookId_test = bookId_test;
exports.property_test = {
    book: {
        bookId: bookId_test
    },
    position: {
        town: 'Osnago',
        province: 'Lecco'
    }
};
exports.wish_test = {
    user: username_test,
    bookId: bookId_test
}
