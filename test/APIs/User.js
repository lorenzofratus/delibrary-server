
let { server, chai, username_test, password_test } = require('../common');

describe('GET /users/login', () => {
    it('GET Login with the test user', (done) => {
        chai.request(server)
            .get(`/v1/users/login?username=${username_test}&password=${password_test}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe('GET /users', () => {
    it('GET all the users', (done) => {
        chai.request(server)
            .get('/v1/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('GET /users/{username}', () => {
    it('GET the test user', (done) => {
        chai.request(server)
            .get(`/v1/users/${username_test}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('password').eql(null);
                done();
            });
    });
});
