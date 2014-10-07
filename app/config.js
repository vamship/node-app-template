/**
 * Defines configuration settings for the server. The module returns a hash,
 * with one key for every environment that is supported. The value of each
 * key is a function that will be invoked to configure the app.
 */

/* jshint node:true */
'use strict';

var _fs = require('fs');
var _path = require('path');
var _rc = require('rc');
var _winston = require('winston');

var _configKeys = {};

function _setConfig(app, key, value) {
    if (!_configKeys.hasOwnProperty(key)) {
        _configKeys[key] = true;
    }
    app.set(key, value);
}

var _configOverrides = {

    /**
     * Special settings that are applied when the application is run in
     * development mode.
     *
     * @param {Object} app  A reference to the express App object.
     */
    dev: function(app) {
        var appVersion = app.get('cfg_app_version');
        _setConfig(app, 'cfg_app_version', appVersion + '__' + (new Date()).getTime());
        _setConfig(app, 'cfg_static_file_cache_duration', 0);
        _setConfig(app, 'cfg_enable_request_logger', true);
        _setConfig(app, 'cfg_enable_dyamic_css_compile', true);
        _setConfig(app, 'cfg_enable_minified_files', false);
    },

    /**
     * Special settings that are applied when the application is run in
     * test mode.
     *
     * @param {Object} app  A reference to the express App object.
     */
    test: function(app) {
        var appVersion = app.get('cfg_app_version');
        _setConfig(app, 'cfg_app_version', appVersion + '__' + (new Date()).getTime());
        _setConfig(app, 'cfg_static_file_cache_duration', 0);
    },

    /**
     * Special settings that are applied when the application is run in
     * production mode.
     *
     * @param {Object} app  A reference to the express App object.
     */
    prod: function(app) {}
};

function _getPackageInfo() {
    var filePath = _path.join(__dirname, '../package.json');
    var data = _fs.readFileSync(filePath);
    var packageInfo = JSON.parse(data.toString());

    return packageInfo;
}

function _getApplicationConfig(appName) {
    // Read configuration settings from the rc file, and set defaults
    // when no settings are available in the file.
    return _rc(appName, {
        port: 3000,
        rootPath: '/',
        proxyPresent: false,
        logsDir: 'logs',
        staticFileCacheDuration: 31356000000
    });
}

module.exports = {

    /**
     * Applies configuration parameters to the application. Some basic
     * configuration is applied, and additionally, if applicable, some
     * environment specific settings are also applied.
     *
     * It is strongly recommended that this module be used to set all
     * application configuration values.
     *
     * @param {Object} app  A reference to the express App object.
     */
    apply: function(app) {
        // Read package info and application configuration settings.
        var packageInfo = _getPackageInfo();
        var appConfig = _getApplicationConfig(packageInfo.name);
        var staticDir = _path.join(__dirname, 'static');
        var env = app.get('env');

        // Common application configuration
        _setConfig(app, 'port', appConfig.port);
        _setConfig(app, 'views', _path.join(__dirname, 'views'));
        _setConfig(app, 'view engine', 'jade');

        _setConfig(app, 'cfg_env', env);
        _setConfig(app, 'cfg_app_name', packageInfo.name);
        _setConfig(app, 'cfg_app_version', packageInfo.version);

        _setConfig(app, 'cfg_static_dir', staticDir);
        _setConfig(app, 'cfg_logs_dir', appConfig.logsDir);
        _setConfig(app, 'cfg_proxy_present', appConfig.proxyPresent);
        _setConfig(app, 'cfg_root_path', appConfig.rootPath);

        // HACK: Just to make sure that this setting shows at this position in
        // the logs. Actual value gets overwritten later.
        _setConfig(app, 'cfg_mount_path', appConfig.rootPath);

        _setConfig(app, 'cfg_static_file_cache_duration', appConfig.staticFileCacheDuration);

        _setConfig(app, 'cfg_enable_request_logger', false);
        _setConfig(app, 'cfg_enable_dyamic_css_compile', false);
        _setConfig(app, 'cfg_enable_minified_files', true);



        app.locals.title = app.get('cfg_app_name');

        // Apply configuration overrides if any have been defined for the
        // environment.
        var applyConfigOverrides = _configOverrides[env];
        if (!applyConfigOverrides) {
            console.info('no config overrides found for environment [' + env + ']');
        } else {
            applyConfigOverrides(app);
        }

        var rootPath = app.get('cfg_root_path');
        var proxyPresent = app.get('cfg_proxy_present');
        var mountPath = proxyPresent ? '/' : rootPath;

        _setConfig(app, 'cfg_mount_path', mountPath);

        // Configure logger.
        _winston.loggers.add('app', {
            console: {
                level: 'silly',
                colorize: 'true',
                label: 'app'
            },
            DailyRotateFile: {
                level: 'info',
                filename: _path.join(app.get('cfg_logs_dir'), 'app'),
                datePattern: '.yyyy-MM-dd.log'
            }
        });
    },

    /**
     * Retrieves all configuration settings keys defined within this module.
     *
     * @return {Array} An array of keys that represent configuration settings
     *                 for the app.
     */
    getKeys: function() {
        return Object.keys(_configKeys);
    }
}
