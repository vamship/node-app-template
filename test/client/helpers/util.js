/**
 * Helper module that provides a few utility methods.
 */
define([], function() {
    'use strict';

    var mod = {
        /**
         * Generates a handler that can be used to resolve a test callback.
         *
         * @param {Function} done The callback that will be resolved.
         * @return {Function} A function that will resolve the callback when
         *                    invoked.
         */
        getSuccessCallback: function(done) {
            return function() {
                done();
            }
        },

        /**
         * Generates a handler that can be used to reject a test callback.
         *
         * @param {Function} done The callback that will be rejected.
         * @return {Function} A function that will reject the callback when
         *                    invoked.
         */
        getFailureCallback: function(done) {
            return function(err) {
                done(err);
            }
        }
    };

    return mod;
});
