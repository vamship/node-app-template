/**
 * Greeting directive.
 */
define(['angular', './module'], function(angular, moduleName) {
    'use strict';

    var name = 'greetingDirective';
    angular.module(moduleName).directive(name, [

        function() {
            return {
                restrict: 'EA',
                templateUrl: '/js/hello-world-module/greeting.html',
                scope: {
                    message: '='
                }
            };
        }
    ]);

    console.debug('Directive [' + name + '] attached to module: [' + moduleName + ']');
    return name;
});
