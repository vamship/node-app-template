/**
 * Defines all routes at the root level of the application.
 */

/* jshint node:true */
'use strict';
var _express = require('express');

module.exports = {
    /**
     * Creates a router object that handles some core root level routes for
     * the application.
     *
     * @param {Object} app  A reference to the express application.
     */
    createRouter: function(app) {
        var router = _express.Router();

        /**
         * Show home page.
         */
        router.get('/', function(req, res) {
            res.render('index', {});
        });

        /**
         * Show help documentation.
         */
        router.get('/help', function(req, res) {
            res.render('help', {});
        });

        /**
         * Request for application status.
         */
        router.get('/__status', function(req, res) {
            var appName = app.get('cfg_app_name');
            var appVersion = app.get('cfg_app_version');
            res.set({
                'Content-Type': 'application/json',
            });
            res.send(200, {
                app: appName,
                version: appVersion,
                timestamp: Date.now()
            });
        });

        return router;
    }
};
