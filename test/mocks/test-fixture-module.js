/**
 * Creates a global module that can be used by other test fixtrures to append
 * angular entities. For example, a compiled template could be attached to this
 * module, and then loaded by test specs.
 */

define(['angular'], function(angular) {
    'use strict';

    var moduleName = '_testFixtureModule';
    try {
        var module = angular.module(moduleName);
    } catch (err) {
        angular.module(moduleName, []);
    }

    return moduleName;
});
