/** 
 * The main file of the module. Ensures that the module, and all components of
 * the module (directives, controllers, etc.) are loaded.
 */
define(['./module',
    './templates',
    './greeting-controller',
    './greeting-directive'
], function(moduleName) {
    'use strict';

    console.debug('Module loaded: [' + moduleName + ']');
    return moduleName;
});
