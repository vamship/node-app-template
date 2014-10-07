/** 
 * Main file - loads all of the other modules required by the app, and
 * bootstraps AngularJS.
 */
require(['angular', 'helloWorldModule'], function(angular, moduleName) {
    'use strict';

    angular.bootstrap(document, [moduleName]);
    console.debug('Application launched');
});
