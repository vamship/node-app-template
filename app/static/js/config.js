/**
 * RequireJS configuration.
 */
(function() {
    'use strict';

    require.config({
        paths: {
            jquery: 'lib/jquery/dist/jquery',
            angular: 'lib/angular/angular',
            uiRouter: 'lib/angular-ui-router/release/angular-ui-router',
            bootstrap: 'lib/bootstrap/dist/js/bootstrap',

            helloWorldModule: 'js/hello-world-module'
        },
        wrapShim: true,
        shim: {
            jquery: {
                exports: '$'
            },
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
            }
        },
        packages: ['helloWorldModule']
    });
})();
