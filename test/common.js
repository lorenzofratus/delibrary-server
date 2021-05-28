const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

exports.chai = chai;
exports.server = require("../index");
exports.username_test = "nicheosala_test";
exports.password_test = "veryStrongPassword";
