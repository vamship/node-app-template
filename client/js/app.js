/** 
 * Main file - loads all of the other modules required by the app, and
 * bootstraps AngularJS.
 */
require(['angular', 'uiRouter', 'helloWorldModule'],
    function(angular, router, helloWorldModule) {
        'use strict';

        var moduleName = 'app';

        angular.module(moduleName, ['ui.router', helloWorldModule])
            .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

                $urlRouterProvider.otherwise('/home');

                $stateProvider.state('home', {
                    url: '/home',
                    template: '<div data-ng-controller="GreetingController">' +
                        '<span data-greeting-directive message="message"/>' +
                        '<button data-ng-click="shout()"> Shout Out! </button>' +
                        '</div>'
                }).state('help', {
                    url: '/help',
                    template: '<div class="help"> Help documentation </div>'
                });
            }]);

        angular.bootstrap(document, [moduleName]);
        console.debug('Application launched');
    });
