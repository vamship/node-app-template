/**
 * Main module that launches the web server. This file typically will not
 * require changes. Route changes have to be made in the ./routes sub package,
 * and configuration changes can be introduced using the ./config.js file.
 */

/* jshint node:true */
'use strict';

var _http = require('http');
var _express = require('express');
var _winston = require('winston');

var _routes = require('./routes');
var _config = require('./config');

var app = _express();

// Application configuration.
_config.apply(app);

// Logger should be initialized by now.
var logger = _winston.loggers.get('app');

// Route configuration.
_routes.apply(app);

// Launch server.
_http.createServer(app).listen(app.get('port'), function() {
    var SEPARATOR = (new Array(81)).join('-');

    logger.silly(SEPARATOR);
    logger.info('Express server started.');
    var settings = _config.getKeys();
    for (var index = 0; index < settings.length; index++) {
        var key = settings[index];
        logger.info('%s = [%s]', key, app.get(key));
    }
    logger.silly(SEPARATOR);
});
