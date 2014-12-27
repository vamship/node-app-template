/* jshint expr:true */
/* global alert:true */
define(['angular',
        'ngMocks',
        'chai',
        'sinon',
        'chaiAsPromised',
        'sinonChai',
        'helloWorldModule'
    ],
    function(_angular,
        _angularMocks,
        _chai,
        _sinon,
        _chaiAsPromised,
        _sinonChai,
        _helloWorldModule) {

        'use strict';
        _chai.use(_sinonChai);
        _chai.use(_chaiAsPromised);
        var expect = _chai.expect;

        describe('helloWorldModule.GreetingController: ', function() {
            var $scope;
            var controller;

            beforeEach(module(_helloWorldModule));

            beforeEach(inject(['$rootScope', '$controller',
                function($rootScope, $controller) {
                    $scope = $rootScope.$new();
                    controller = $controller('GreetingController', {
                        $scope: $scope
                    });
                }
            ]));

            it('should define the necessary fields and methods', function() {
                expect($scope).to.have.property('message').and.to.be.an('object');
                expect($scope).to.have.property('shout').and.to.be.a('function');
            });

            describe('message:', function() {
                it('should have a salutation property of "Mr."', function() {
                    expect($scope.message).to.have.property('salutation', 'Mr.');
                });
                it('should have a name property of "World"', function() {
                    expect($scope.message).to.have.property('name', 'World');
                });
                it('should have a greeting property of "Hello"', function() {
                    expect($scope.message).to.have.property('greeting', 'Hello');
                });
            });

            describe('shout:', function() {
                var oldAlert;
                beforeEach(function() {
                    oldAlert = window.alert;
                    window.alert = _sinon.spy();
                });

                afterEach(function() {
                    window.alert = oldAlert;
                });

                it('should show an alert message when invoked', function() {
                    $scope.shout();
                    expect(window.alert).to.have.been.calledWith('Hello, Mr. World!');
                });
            });
        });
    });
