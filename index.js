'use strict'


var express = require('express');
var app = express();
var http = require('http');

var port = process.env.PORT || 9865;

var utils = require('./utils.js')(app, express);

// Routes
require('./routes.js')(app, express, http);

var server = http.createServer(app);
server.listen(port, function() {
  console.log("Node server running on http://localhost:"+port);
  });

module.exports = app;