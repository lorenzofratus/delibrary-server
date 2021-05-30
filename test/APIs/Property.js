let { server, chai, username_test, bookId_test, wish_test, property_test } = require('../common');

let property_id = undefined;

describe('POST /users/{username}/properties/new', () => {
    it("POST a new property", (done) => {
        chai.request(server)
            .post(`/v1/users/${username_test}/properties/new`)
            .send(property_test)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('owner').eql(username_test);
                res.body.should.have.property('bookId').eql(bookId_test);
                res.body.should.have.property('town').eql(property_test.position.town.toLowerCase());
                res.body.should.have.property('province').eql(property_test.position.province.toLowerCase());
                res.body.should.have.property('isInAgreedExchange').eql(false);
                property_id = res.body.id;
                done();
            });
    });

    it("BAD POST a new property without body properties 'book' and 'province'", (done) => {
        chai.request(server)
            .post(`/v1/users/${username_test}/properties/new`)
            .send({
                bookId: bookId_test,
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
            .post(`/v1/users/${username_test}/properties/new`)
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
            .post(`/v1/users/${username_test}/properties/new`)
            .send(property_test)
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
            .put(`/v1/properties/${property_id}/position`)
            .send({newProvince : newProvince, newTown: newTown})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('owner').eql(username_test);
                res.body.should.have.property('bookId').eql(bookId_test);
                res.body.should.have.property('town').eql(newProvince.toLowerCase());
                res.body.should.have.property('province').eql(newTown.toLowerCase());
                res.body.should.have.property('isInAgreedExchange').eql(false);
                done();
            });
    });

    it("BAD PUT a new position with no values for newProvince and newTown", (done) => {

        chai.request(server)
            .put(`/v1/properties/${property_id}/position`)
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
            .delete(`/v1/users/${username_test}/properties/${property_id}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('BAD DELETE a property with a non valid ID.', (done) => {
        chai.request(server)
            .delete(`/v1/users/${username_test}/properties/-1`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});

