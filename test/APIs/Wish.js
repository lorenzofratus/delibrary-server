'use strict';

let { server, chai, wish_test } = require('../common');

describe('POST /users/{username}/wishes/new', () => {
    it("POST a new wish", (done) => {
        chai.request(server)
            .post(`/v1/users/${wish_test.user}/wishes/new`)
            .send(wish_test)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('id').not.eql(null);
                res.body.should.have.property('user').eql(wish_test.user);
                res.body.should.have.property('bookId').eql(wish_test.bookId);
                wish_test.id = res.body.id;
                done();
            });
    });

    it("BAD POST a new wish WITHOUT required fields", (done) => {
        const fake_wish = {};

        chai.request(server)
            .post(`/v1/users/${wish_test.user}/wishes/new`)
            .send(fake_wish)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it("BAD POST a wish already inserted into the database", (done) => {

        chai.request(server)
            .post(`/v1/users/${wish_test.user}/wishes/new`)
            .send(wish_test)
            .end((err, res) => {
                res.should.have.status(409);
                done();
            });
    });
});

describe('GET /users/{username}/wishes', () => {
    it("GET wishes of test user", (done) => {
        chai.request(server)
            .get(`/v1/users/${wish_test.user}/wishes`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('GET /users/{username}/wishes/{id}', () => {
    it('GET the test wish', (done) => {
        chai.request(server)
            .get(`/v1/users/${wish_test.user}/wishes/${wish_test.id}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });
});

describe('DELETE /users/{username}/wishes/{id}', () => {
    it('DELETE the test wish', (done) => {
        chai.request(server)
            .delete(`/v1/users/${wish_test.user}/wishes/${wish_test.id}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('BAD DELETE a wish with a non valid ID.', (done) => {
        chai.request(server)
            .delete(`/v1/users/${wish_test.user}/wishes/-1`)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
