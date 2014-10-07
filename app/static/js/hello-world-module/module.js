/**
 * Module definition file.
 */
define(['angular'], function(angular) {
    'use strict';

    var moduleName = 'helloWorldModule';
    angular.module(moduleName, []);

    console.debug('Module created: [' + moduleName + ']');
    return moduleName;
});
