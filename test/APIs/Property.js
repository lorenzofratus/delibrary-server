'use strict';

let { server, chai, property_test, book_and_position } = require('../common');

describe('POST /users/{username}/properties/new', () => {
    it("POST a new property", (done) => {
        chai.request(server)
            .post(`/v1/users/${property_test.owner}/properties/new`)
            .send(book_and_position)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('owner').eql(property_test.owner);
                res.body.should.have.property('bookId').eql(property_test.bookId);
                res.body.should.have.property('town').eql(property_test.town.toLowerCase());
                res.body.should.have.property('province').eql(property_test.province.toLowerCase());
                res.body.should.have.property('isInAgreedExchange').eql(false);
                property_test.id = res.body.id;
                done();
            });
    });

    it("BAD POST a new property without body properties 'book' and 'province'", (done) => {
        chai.request(server)
            .post(`/v1/users/${property_test.owner}/properties/new`)
            .send({
                bookId: property_test.bookId,
                town: 'osnago',
                province: 'lecco'
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST a new property without body properties 'bookId' and 'town'", (done) => {
        chai.request(server)
            .post(`/v1/users/${property_test.owner}/properties/new`)
            .send({
                book: {},
                position: {}
            })
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST a new property with the exact same owner, bookId, town, province of a previous one", (done) => {
        chai.request(server)
            .post(`/v1/users/${property_test.owner}/properties/new`)
            .send(book_and_position)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
});

describe('PUT /properties/{id}/position', () => {
    it("PUT a new position for the test property", (done) => {

        const newProvince = 'bergamo';
        const newTown = 'bergamo';

        chai.request(server)
            .put(`/v1/properties/${property_test.id}/position`)
            .send({newProvince : newProvince, newTown: newTown})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('owner').eql(property_test.owner);
                res.body.should.have.property('bookId').eql(property_test.bookId);
                res.body.should.have.property('town').eql(newProvince.toLowerCase());
                res.body.should.have.property('province').eql(newTown.toLowerCase());
                res.body.should.have.property('isInAgreedExchange').eql(false);
                done();
            });
    });

    it("BAD PUT a new position with no values for newProvince and newTown", (done) => {

        chai.request(server)
            .put(`/v1/properties/${property_test.id}/position`)
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
});

describe('GET /properties/{province}', () => { /* TODO */ });
describe('GET /properties/{province}/{town}', () => { /* TODO */ });
describe('GET /users/{username}/properties', () => { /* TODO */ });
describe('GET /users/{username}/properties/{id}', () => { /* TODO */ });

describe('DELETE /users/{username}/properties/{id}', () => {
    it('DELETE the test property', (done) => {
        chai.request(server)
            .delete(`/v1/users/${property_test.owner}/properties/${property_test.id}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('BAD DELETE a property with a non valid ID.', (done) => {
        chai.request(server)
            .delete(`/v1/users/${property_test.owner}/properties/-1`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});

