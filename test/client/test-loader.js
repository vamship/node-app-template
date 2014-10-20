/**
 * Test script bootstrapper for unit tests. This enables the use of requirejs
 * modules when developing and testing.
 */

(function() {
    'use strict';

    var allTestFiles = [];
    var TEST_REGEXP = /(spec|test)\.js$/i;

    var pathToModule = function(path) {
        return path.replace(/^\/base\//, '').replace(/\.js$/, '');
    };

    Object.keys(window.__karma__.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            allTestFiles.push(pathToModule(file));
        }
    });

    // Suppress any console.debug statements.
    console.debug = function() {};

    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: '/base',

        // Note that the build process integrates some of these files (jquery,
        // angularjs, etc) into a single file (app.min.js). Once this happens,
        // the path references to thes libraries below will no longer be used.
        // These references are only present so that tests against unbuilt
        // sources function as expected.
        paths: {
            // References required when testing dev and build artifacts.
            ngMocks: 'app/static/lib/angular-mocks/angular-mocks',
            mocks: 'test/mocks',
            helpers: 'test/client/helpers',

            // References required when testing dev artifacts only.
            // The build prefix has been included to prevent karma errors).
            // When the build prefix is non empty:
            //  - These paths point to non existent files.
            //  - The actual file contents should be a part of the build artifact.
            //  - The only reason that we even need this is because Karma/
            //    PhantomJS is/are looking for paths to point to folders
            //    included in the test scope.
            jquery: 'app/static/lib/jquery/dist/jquery',
            angular: 'app/static/lib/angular/angular',
            uiRouter: 'app/static/lib/angular-ui-router/release/angular-ui-router',
            bootstrap: 'app/static/lib/bootstrap/dist/js/bootstrap',
            helloWorldModule: 'app/static/js/hello-world-module'
        },

        wrapShim: true,

        shim: {
            angular: {
                deps: ['jquery'],
                exports: 'angular'
            },
            uiRouter: {
                deps: ['angular']
            },
            bootstrap: {
                deps: ['jquery'],
                exports: '$.fn.popover'
            },
            ngMocks: {
                deps: ['angular'],
                exports: 'angular.mocks'
            }
        },

        packages: ['helloWorldModule'],

        // dynamically load all test files
        deps: allTestFiles,

        // we have to kickoff jasmine, as it is asynchronous
        callback: window.__karma__.start
    });
})();
