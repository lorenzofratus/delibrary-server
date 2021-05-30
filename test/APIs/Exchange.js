let { server, chai, username_test, password_test } = require('../common');

describe('GET /users/{sellerUsername}/exchanges/active/seller', () => { });
describe('GET /users/{buyerUsername}/exchanges/active/buyer', () => { });
describe('GET /users/{sellerUsername}/exchanges/archived/seller', () => { });
describe('GET /users/{buyerUsername}/exchanges/archived/buyer', () => { });
describe('GET /users/{username}/exchanges/active', () => { });
describe('POST /users/{buyerUsername}/exchanges/new', () => { });
describe('DELETE /exchanges/{id}', () => { });
describe('PUT /exchanges/{id}/refuse', () => { });
describe('PUT /exchanges/{id}/agree', () => { });
describe('PUT /exchanges/{id}/happen', () => { });
