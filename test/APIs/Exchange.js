'use strict';

const { database } = require('../../service/DataLayer');
const { status } = require('../../service/ExchangeService');
let { server, chai, user_test } = require('../common');

const seller = user_test;

const buyer = {
    surname: "Ferraresi",
    name: "Gregorio",
    email: "gregorio.ferraresi@domain.org",
    username: "jst_greg_test",
    password: "VeryStrongPassword"
};

const property_seller_test = {
    id: 345,
    owner: seller.username,
    bookId: "MNOPWJTvuxoC",
    province: "Lecco",
    town: "Osnago"
};

let exchange_test = {
    id: undefined,
    buyer: buyer.username,
    seller: seller.username,
    property: property_seller_test.id,
    payment: undefined,
    status: undefined
};

const payment_buyer_test = {
    id: 9876,
    owner: buyer.username,
    bookId: "MNOPAAAvuxoA",
    province: "Bergamo",
    town: "Bergamo"
};

before(async () => {
    try { await database('users').insert(buyer); } catch { }
    try { await database('properties').insert(property_seller_test); } catch { }
    try { await database('properties').insert(payment_buyer_test); } catch { }
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

describe('DELETE /exchanges/{id}', () => {

    it('DELETE the test exchange', () => {
        chai.request(server)
            .delete(`/v1/exchanges/${exchange_test.id}`)
            .end(async (err, res) => {
                res.should.have.status(200);
                try {
                    let [property] = await database('properties').where({ id: exchange_test['property'] });
                    property.should.have.property('isInAgreedExchange').eql(false);
                } catch (error) { console.error(error) };
                try {
                    if (exchange_test['payment']) {
                        let [payment] = await database('properties').where({ id: exchange_test['payment'] });
                        payment.should.have.property('isInAgreedExchange').eql(false);
                    }
                } catch (error) { console.error(error) };
            });
    });

    it('BAD DELETE exchange with a non valid ID.', (done) => {
        chai.request(server)
            .delete(`/v1/exchanges/-1`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});

describe('PUT /exchanges/{id} from PROPOSED', () => {

    let exchange_sample = {
        id: 12,
        buyer: buyer.username,
        seller: seller.username,
        property: property_seller_test.id,
        payment: undefined,
        status: status.PROPOSED
    };

    beforeEach(async () => {
        try { await database('exchanges').insert(exchange_sample); } catch { }
    });

    afterEach(async () => {
        try { await database('exchanges').del({ id: exchange_sample.id }); } catch { }
    })

    it("PUT an exchange from proposed to refused", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/refuse`)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('buyer').not.eql(null);
                res.body.should.have.property('seller').not.eql(null);
                res.body['buyer'].should.have.property('username').eql(buyer.username);
                res.body['seller'].should.have.property('username').eql(seller.username);
                res.body.should.have.property('propertyBookId').eql(property_seller_test.bookId);
                res.body.should.have.property('paymentBookId').eql(null);
                res.body.should.have.property('status').eql(status.REFUSED);
                done();
            });
    });

    it("BAD PUT an exchange from proposed to happened", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/happen`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("PUT an exchange from proposed to agreed", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/agree`)
            .send({ paymentId: payment_buyer_test.id })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            });
    });
});

describe('PUT /exchanges/{id} from AGREED', () => {

    let exchange_sample = {
        id: 13,
        buyer: buyer.username,
        seller: seller.username,
        property: property_seller_test.id,
        payment: payment_buyer_test.id,
        status: status.AGREED
    };

    beforeEach(async () => {
        try { await database('exchanges').insert(exchange_sample); } catch { }
    });

    afterEach(async () => {
        try { await database('exchanges').del({ id: exchange_sample.id }); } catch { }
    })

    it("PUT an exchange from agreed to refused", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/refuse`)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('buyer').not.eql(null);
                res.body.should.have.property('seller').not.eql(null);
                res.body['buyer'].should.have.property('username').eql(buyer.username);
                res.body['seller'].should.have.property('username').eql(seller.username);
                res.body.should.have.property('propertyBookId').eql(property_seller_test.bookId);
                res.body.should.have.property('paymentBookId').eql(payment_buyer_test.bookId);
                res.body.should.have.property('status').eql(status.REFUSED);
                done();
            });
    });

    it("PUT an exchange from agreed to happened", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/happen`)
            .end(async (err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('buyer').not.eql(null);
                res.body.should.have.property('seller').not.eql(null);
                res.body.should.have.property('propertyBookId').eql(property_seller_test.bookId);
                res.body.should.have.property('paymentBookId').eql(payment_buyer_test.bookId);
                res.body.should.have.property('status').eql(status.HAPPENED);

                const updated_property = await database('properties').where({ id: property_seller_test.id }).first();
                const updated_payment = await database('properties').where({ id: payment_buyer_test.id }).first();

                updated_property.should.have.property('owner').eql(payment_buyer_test.owner);
                updated_property.should.have.property('town').eql(payment_buyer_test.town);
                updated_property.should.have.property('province').eql(payment_buyer_test.province);
                updated_property.should.have.property('isInAgreedExchange').eql(false);

                updated_payment.should.have.property('owner').eql(property_seller_test.owner);
                updated_payment.should.have.property('town').eql(property_seller_test.town);
                updated_payment.should.have.property('province').eql(property_seller_test.province);
                updated_payment.should.have.property('isInAgreedExchange').eql(false);

                done();
            });
    });

    it("BAD PUT an exchange from agreed to agreed", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/agree`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

});

describe('PUT /exchanges/{id} from REFUSED', () => {

    let exchange_sample = {
        id: 14,
        buyer: buyer.username,
        seller: seller.username,
        property: property_seller_test.id,
        payment: payment_buyer_test.id,
        status: status.REFUSED
    };

    beforeEach(async () => {
        try { await database('exchanges').insert(exchange_sample); } catch { }
    });

    afterEach(async () => {
        try { await database('exchanges').del({ id: exchange_sample.id }); } catch { }
    })

    it("BAD PUT an exchange from refused to refused", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/refuse`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD PUT an exchange from refused to happened", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/happen`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD PUT an exchange from refused to agreed", (done) => {
        chai.request(server)
            .put(`/v1/exchanges/${exchange_sample.id}/agree`)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
});


after(async () => {
    try { await database('users').del(buyer); } catch { }
    try { await database('archivedexchanges').del('*'); } catch { }
    try { await database('exchanges').del('*'); } catch { }
    try { await database('properties').del('*'); } catch { }
});
