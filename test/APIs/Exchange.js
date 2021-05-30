'use strict';

const { database } = require('../../service/DataLayer');
let { server, chai, user_test } = require('../common');

const seller = user_test;

const buyer = {
    surname: "Ferraresi",
    name: "Gregorio",
    email: "gregorio.ferraresi@domain.org",
    username: "jst_greg_test",
    password: "VeryStrongPassword"
};

let seller_property = {
    id: 10,
    owner: seller.username,
    bookId: "MNOPWJTvuxoC",
    province: "Lecco",
    town: "Osnago"
};

let exchange_test = {
    id: undefined,
    buyer: buyer.username,
    seller: seller.username,
    property: seller_property.id,
    payment: undefined,
    status: undefined
};

before(async () => {
    try { await database('users').insert(buyer); } catch { }
    try { await database('properties').insert(seller_property); } catch { }
});

describe('POST /users/{buyerUsername}/exchanges/new', () => {
    it("POST a new exchange", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({
                sellerUsername: exchange_test.seller,
                propertyId: exchange_test.property
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('buyer').eql(exchange_test.buyer);
                res.body.should.have.property('seller').eql(exchange_test.seller);
                res.body.should.have.property('property').eql(exchange_test.property);
                res.body.should.have.property('payment').eql(null);
                res.body.should.have.property('status');
                exchange_test.id = res.body.id;
                done();
            });
    });

    it("BAD POST an exchange without sellerUsername and propertyId", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST an exchange with non valid propertyId", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({
                sellerUsername: exchange_test.seller,
                propertyId: -1
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST an exchange with non valid sellerUsername", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({
                sellerUsername: 'usernameNotInDatabase',
                propertyId: exchange_test.property
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST an exchange with equal sellerUsername and buyerUsername", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({
                sellerUsername: exchange_test.buyer,
                propertyId: exchange_test.property
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST an exchange with same buyer, seller and property of another", (done) => {
        chai.request(server)
            .post(`/v1/users/${exchange_test.buyer}/exchanges/new`)
            .send({
                sellerUsername: exchange_test.seller,
                propertyId: exchange_test.property
            })
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
});

describe('GET /users/{sellerUsername}/exchanges/active/seller', () => { });
describe('GET /users/{buyerUsername}/exchanges/active/buyer', () => { });
describe('GET /users/{sellerUsername}/exchanges/archived/seller', () => { });
describe('GET /users/{buyerUsername}/exchanges/archived/buyer', () => { });
describe('GET /users/{username}/exchanges/active', () => { });
describe('DELETE /exchanges/{id}', () => { });
describe('PUT /exchanges/{id}/refuse', () => { });
describe('PUT /exchanges/{id}/agree', () => { });
describe('PUT /exchanges/{id}/happen', () => { });

after(async () => {
    try { await database('users').del(buyer); } catch { }
    try { await database('properties').del(seller_property); } catch { }
});
