/**
 * Greeting controller.
 */
define(['angular', './module'], function(angular, moduleName) {
    'use strict';

    var name = 'GreetingController';
    angular.module(moduleName).controller(name, ['$scope',
        function($scope) {
            $scope.message = {
                name: 'World',
                salutation: 'Mr.',
                greeting: 'Hello'
            };
            $scope.shout = function() {
                var message = $scope.message;
                alert(message.greeting + ', ' + message.salutation + ' ' +
                    message.name + '!');
            };
        }
    ]);

    console.debug('Controller [' + name + '] attached to module: [' + moduleName + ']');
    return name;
});
