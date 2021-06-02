let { usersDbSetup } = require("./UserService");
let { exchangesDbSetup } = require("./ExchangeService");
let { propertiesDbSetup } = require("./PropertyService");
let { wishesDbSetup } = require("./WishService");
let { archivedExchangesDbSetup } = require("./ArchivedExchangeService");

const knex = require("knex");

const conn = process.env.DATABASE_URL || (process.env.NODE_ENV === 'test' ? "postgres://postgres:dana@localhost:5433/delibrarydbtest" : "postgres://postgres:dana@localhost:5433/delibrarydb");

let sqlDb = knex({
    client: "pg",
    debug: process.env.NODE_ENV === 'debug',
    connection: conn,
    ssl: {
        require: false,
        rejectUnauthorized: false
    },
    useNullAsDefault: true  // When inserting new values into the db, the default empty value is NULL.
});

function setupDataLayer() {
    console.log("Setting up data layer...");
    return Promise.all([
        usersDbSetup(sqlDb),
        propertiesDbSetup(sqlDb),
        exchangesDbSetup(sqlDb),
        archivedExchangesDbSetup(sqlDb),
        wishesDbSetup(sqlDb)
    ]);
}

module.exports = { database: sqlDb, setupDataLayer };