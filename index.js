'use strict';

var fs = require('fs'),
  path = require('path');

var app = require('express')();
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
const { setupDataLayer } = require('./service/DataLayer');

let morgan = require('morgan');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const sessionLogger = require('./middlewares/SessionLogger');
const checkLogin = require('./middlewares/CheckLogin');

const openRoutes = [
  "/v1/users/login",
  "/v1/users/login/me",
  "/v1/users/new"
];

var port = process.env.PORT || 8080;

// Session configuration
app.use(cookieParser());
app.use(session({
  name: 'delibrary-sid',
  secret: 'super secret password',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false,        //Needs HTTPS to be true
    httpOnly: false,
    maxAge: null,         //The cookie doesn't expire
  }
}))

const unless = function (pathList, middleware) {
  return function (req, res, next) {
    if (!req.path.startsWith('/v1') || pathList.includes(req.path) || process.env.NODE_ENV === 'test') {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

if (process.env.NODE_ENV === 'debug') {
  app.use(sessionLogger);
  app.use(morgan('tiny'));
} else {
  console.log = console.debug = console.warn = console.error = () => {};
}

app.use(unless(openRoutes, checkLogin));

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname, 'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
});

// Start the server
(async () => await setupDataLayer())();
const server = app.listen(port, () =>
  console.log(`Listening on port ${port}`));

module.exports = server;