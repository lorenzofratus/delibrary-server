let { usersDbSetup } = require("./UserService");
let { exchangesDbSetup } = require("./ExchangeService");
let { propertiesDbSetup } = require("./PropertyService");
let { wishesDbSetup } = require("./WishService");

const knex = require("knex");

let sqlDb = knex({
    client: "pg",
    debug: true,
    /* For local work: 'DATABASE_URL=postgres://postgres:dana@localhost:5432/delibrarydb node index.js'
     * For Heroku, set the correct value of DATABASE_URL. See 'heroku config' */
    connection: process.env.DATABASE_URL,
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
        wishesDbSetup(sqlDb)
    ]);
}

module.exports = { database: sqlDb, setupDataLayer };