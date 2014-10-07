/**
 * Defines all the routes supported by the server. For the sake of
 * managability, it is recommended that routes be defined in individual
 * modules that are in turn loaded and used by this module.
 */

/* jshint node:true */
'use strict';
var _path = require('path');
var _express = require('express');
var _favicon = require('serve-favicon');

var _public = require('./routes/public');

module.exports = {

    /**
     * Attaches route handlers to the web application. The handlers may be
     * defined within this module, or may be defined in other modules, and
     * just attached to specific routes within this one.
     *
     * @param {Object} app  A reference to the express App object.
     */
    apply: function(app) {
        var enableLogger = app.get('cfg_enable_request_logger');
        var enableDynamicCss = app.get('cfg_enable_dyamic_css_compile');

        var staticDir = app.get('cfg_static_dir');
        var rootPath = app.get('cfg_root_path');
        var mountPath = app.get('cfg_mount_path');
        var staticFileCacheDuration = app.get('cfg_static_file_cache_duration');

        // Conditional middlewares.
        if (enableLogger) {
            var morgan = require('morgan');
            app.use(morgan('dev'));
        }

        // When injected, dynamically generates css files from sass files.
        // Intended for use in development mode only. Production
        // deployments must pre compile sass --> css prior to deployment.
        if (enableDynamicCss) {
            var sassMiddleware = require('node-sass-middleware');
            app.use(sassMiddleware({
                src: staticDir,
                prefix: rootPath,
                debug: true,
                response: true,
                outputStyle: 'nested'
            }));
        }

        function forPath(path) {
            path = path || '';
            path = _path.join(mountPath, path);

            var mounter = {
                addHandler: function(handler) {
                    app.use(path, handler);
                    return mounter;
                }
            };
            return mounter;
        }

        // Handle requests for favicon.ico
        app.use(_favicon(_path.join(staticDir, 'img/favicon.ico')));

        // Mount the routers at the specified base paths.
        forPath('/')
            .addHandler(_express.static(staticDir))
            .addHandler(_public.createRouter(app));
    }
};
