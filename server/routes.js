/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));


  app.use('/api/books', require('./api/book'));
  app.use("/api/places", require("./api/place"));
  app.use("/api/music", require("./api/music"));
  app.use("/api/movies", require("./api/movie"));
  app.use("/api/shows", require("./api/show"));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);
  app.route('/*')
    .get(function(req, res) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.render('index', {title: "Sonder"});
    });
};
