'use strict';

process.env.NODE_ENV = 'test';
let { database } = require("../service/DataLayer");
let { server, chai, username_test, password_test } = require('./common');

function execute(name, path) {
    describe(name, () => require(path));
}

describe('Tests', () => {

    describe('POST /users/new', () => {
        it("POST a new test user", (done) => {
            const user = {
                surname: "Sala",
                name: "Nicolò",
                email: "nicolo.sala@domain.org",
                username: username_test,
                password: password_test
            }

            chai.request(server)
                .post('/v1/users/new')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').not.eql(null);
                    res.body.should.have.property('name').not.eql(null);
                    res.body.should.have.property('surname').not.eql(null);
                    res.body.should.have.property('email').not.eql(null);
                    res.body.should.have.property('password').eql(null);
                    done();
                });
        })
    });

    execute('User test', './APIs/User');
    execute('Wish test', './APIs/Wish');
    execute('Property test', './APIs/Property');
    execute('Exchange test', './APIs/Exchange');

    describe('DELETE /users/{username}', () => {
        it('DELETE the test user', (done) => {
            chai.request(server)
                .delete(`/v1/users/${username_test}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    // TODO: removing the test user, also all its wishes, properties and active exchanges should be destoyed

    after((done) => {
        database.destroy();
        done();
    });
});