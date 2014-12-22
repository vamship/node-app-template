/* jshint expr:true  */
/* global chai:false, sinon:false */
define(['angular',
        'ngMocks',
        'chaiAsPromised',
        'helpers/mouse',
        'mocks/test-fixture-module',
        'helloWorldModule'
    ],
    function(angular,
        angularMocks,
        chaiAsPromised,
        mouseHelper,
        testFixtureModule,
        helloWorldModule) {

        'use strict';
        chai.use(chaiAsPromised);
        var expect = chai.expect;

        describe('helloWorldModule.greetingDirective: ', function() {
            var dirElement;
            var scope;

            beforeEach(module(testFixtureModule));
            beforeEach(module(helloWorldModule));

            beforeEach(inject(['$rootScope', '$compile',
                function($rootScope, $compile) {
                    dirElement = angular.element(
                        '<div data-greeting-directive message="message" />');
                    scope = $rootScope.$new();
                    scope.message = {
                        salutation: 'Mr.',
                        name: 'World',
                        greeting: 'Hello'
                    };
                    $compile(dirElement)(scope);
                    scope.$digest();
                }
            ]));

            /**
             * Test the DOM structure of the directive.
             */
            describe('DOM structure:', function() {
                it('the top level container element must be a <div> tag', function() {
                    var childElements = dirElement.children();

                    expect(childElements).to.have.length(1);
                    expect(childElements[0]).to.equal(dirElement.find('div')[0]);
                });

                it('the top level container must have two <div> elements for message and form', function() {
                    var topElement = dirElement.children().eq(0);
                    var innerElements = topElement.children();
                    var innerElementByTag = topElement.find('div').eq(0);

                    expect(innerElements).to.have.length(2);
                    expect(innerElements[0]).to.equal(innerElementByTag[0]);

                    innerElementByTag = innerElementByTag.next();
                    expect(innerElements[1]).to.equal(innerElementByTag[0]);
                });

                describe('form element:', function() {
                    var formElement;
                    beforeEach(function() {
                        formElement = dirElement.children().eq(0)
                            .children().eq(0);
                    });

                    it('should have class="form"', function() {
                        expect(formElement.hasClass('form')).to.be.ok;
                    });

                    it('should contain three <div> elements, with class="field"', function() {
                        var innerElements = formElement.children();
                        var innerElementByTag = formElement.find('div').eq(0);

                        expect(innerElements).to.have.length(3);
                        expect(innerElements[0]).to.equal(innerElementByTag[0]);
                        expect(innerElements.eq(0).hasClass('field')).to.be.ok;

                        innerElementByTag = innerElementByTag.next();
                        expect(innerElements[1]).to.equal(innerElementByTag[0]);
                        expect(innerElements.eq(0).hasClass('field')).to.be.ok;

                        innerElementByTag = innerElementByTag.next();
                        expect(innerElements[2]).to.equal(innerElementByTag[0]);
                        expect(innerElements.eq(0).hasClass('field')).to.be.ok;
                    });

                    it('the first inner element should have an input field with inital value="Hello"', function() {
                        var testElement = formElement.find('div').eq(0)
                            .find('input').eq(0);

                        expect(testElement.val()).to.equal('Hello');
                    });

                    it('the second inner element should have two radio buttons with values "Mr." and "Ms."', function() {
                        var testElement = formElement.find('div').eq(1)
                            .find('input');

                        expect(testElement).to.have.length(2, 'Salutation radio buttons');
                        expect(testElement.eq(0).val()).to.equal('Mr.', 'Salutation radio #1');
                        expect(testElement.eq(1).val()).to.equal('Ms.', 'Salutation radio #2');
                    });

                    it('the third inner element should have an input field with inital value="World"', function() {
                        var testElement = formElement.find('div').eq(2)
                            .find('input').eq(0);

                        expect(testElement.val()).to.equal('World', 'Name text box');
                    });

                });

                describe('message element:', function() {
                    var messageElement;
                    beforeEach(function() {
                        messageElement = dirElement.children().eq(0)
                            .children().eq(1);
                    });

                    it('should have class="message"', function() {
                        expect(messageElement.hasClass('message')).to.be.ok;
                    });

                    it('should contain three <span> elements', function() {
                        var innerElements = messageElement.children();
                        var innerElementByTag = messageElement.find('span').eq(0);

                        expect(innerElements).to.have.length(3);
                        expect(innerElements[0]).to.equal(innerElementByTag[0]);

                        innerElementByTag = innerElementByTag.next();
                        expect(innerElements[1]).to.equal(innerElementByTag[0]);

                        innerElementByTag = innerElementByTag.next();
                        expect(innerElements[2]).to.equal(innerElementByTag[0]);
                    });

                    it('the first inner element must have class="greeting"', function() {
                        var testElement = messageElement.find('span').eq(0);

                        expect(testElement.hasClass('greeting')).to.be.ok;
                    });

                    it('the second inner element must have class="salutation"', function() {
                        var testElement = messageElement.find('span').eq(1);

                        expect(testElement.hasClass('salutation')).to.be.ok;
                    });

                    it('the third inner element must have class="name"', function() {
                        var testElement = messageElement.find('span').eq(2);

                        expect(testElement.hasClass('name')).to.be.ok;
                    });

                    it('should have contents that read "Hello, Mr. World!"', function() {
                        var testElement = dirElement.find('div.message');
                        var text = testElement.eq(0).text();
                        text = text.replace(/\n/mg, '').replace(/\s+/g, ' ').trim();
                        expect(text).to.equal('Hello, Mr. World!');
                    });
                });
            });

            /**
             * Test the behavior of the directive.
             */
            describe('behavior:', function() {
                var messageElement;
                var formElement;
                beforeEach(function() {
                    var topLevelElements = dirElement.children().eq(0)
                        .children();
                    formElement = topLevelElements.eq(0);
                    messageElement = topLevelElements.eq(1);
                });

                it('should update the greeting when the greeting textbox is updated.', function() {
                    var greetingTextbox = formElement.children().eq(0)
                        .find('input').eq(0);
                    var greetingText = messageElement.children().eq(0);

                    expect(greetingText.text()).to.equal('Hello');
                    greetingTextbox.val('Bonjour');
                    greetingTextbox.trigger('input');
                    expect(greetingText.text()).to.equal('Bonjour');
                });

                it('should update the salutation when the salutation radio button selection is updated.', function() {
                    var salutationMr = formElement.children().eq(1)
                        .find('input').eq(0);
                    var salutationMs = formElement.children().eq(1)
                        .find('input').eq(1);
                    var salutationText = messageElement.children().eq(1);

                    expect(salutationText.text()).to.equal('Mr.');
                    mouseHelper.click(salutationMs[0]);
                    expect(salutationText.text()).to.equal('Ms.');
                });

                it('should update the name when the name textbox is updated.', function() {
                    var nameTextbox = formElement.children().eq(2)
                        .find('input').eq(0);
                    var nameText = messageElement.children().eq(2);

                    expect(nameText.text()).to.equal('World');
                    nameTextbox.val('Earth');
                    nameTextbox.trigger('input');
                    expect(nameText.text()).to.equal('Earth');
                });
            });
        });
    });
