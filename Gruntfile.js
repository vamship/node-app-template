/* jshint node:true */
'use strict';

var _fs = require('fs');
var _promise = require('wysknd-lib').promise;
var _utils = require('wysknd-lib').utils;
var _folder = require('wysknd-lib').folder;

// -------------------------------------------------------------------------------
//  Help documentation
// -------------------------------------------------------------------------------
var HELP_TEXT =
'--------------------------------------------------------------------------------\n' +
' Defines tasks that are commonly used during the development process. This      \n' +
' includes tasks for linting, building and testing.                              \n' +
'                                                                                \n' +
' Supported Tasks:                                                               \n' +
'   [default]         : Performs standard pre-checkin activities. Runs           \n' +
'                       jsbeautifier on all source files (html and css files are \n' +
'                       also beautified), then runs jshint, and then executes all\n' +
'                       tests against the source files.                          \n' +
'                                                                                \n' +
'   env               : Provides information regarding the current environment.  \n' +
'                       This an information only task that does not alter any    \n' +
'                       file/folder in the environment.                          \n' +
'                                                                                \n' +
'   help              : Shows this help message.                                 \n' +
'                                                                                \n' +
'   clean             : Cleans out all build artifacts and other temporary files \n' +
'                       or directories.                                          \n' +
'                                                                                \n' +
'   monitor:[opt1]:   : Monitors files for changes, and triggers actions based   \n' +
'           [opt2]:     on specified options. Supported options are as follows:  \n' +
'           [opt3]:       [lint]   : Executes jshint with default options against\n' +
'           [opt4]:                  all source files.                           \n' +
'           [opt5]        [client] : Executes client side unit tests against all \n' +
'                                    source files.                               \n' +
'                         [server] : Executes server side unit tests against all \n' +
'                                    source files. This task will automatically  \n' +
'                                    launch the web server prior to running the  \n' +
'                                    tests, and shutdown the server after the    \n' +
'                                    tests have been executed.                   \n' +
'                         [e2e]    : Executes end to end tests against all source\n' +
'                                    files. This task will automatically launch  \n' +
'                                    the web server prior to running tests, and  \n' +
'                                    shut down the server after the tests have   \n' +
'                                    been executed.                              \n' +
'                         [build]  : Performs a full build/test cycle. This      \n' +
'                                    includes linting, building and testing of   \n' +
'                                    all build artifacts (unit and e2e). If this \n' +
'                                    task is specified, all others will be       \n' +
'                                    ignored.                                    \n' +
'                                                                                \n' +
'                       Multiple options may be specified, and the triggers will \n' +
'                       be executed in the order specified. If a specific task   \n' +
'                       requires a web server to be launched, this will be done  \n' +
'                       automatically.                                           \n' +
'                                                                                \n' +
'   jshint:dev        : Executes jshint against all source files.                \n' +
'                                                                                \n' +
'   build:[debugMode] : Builds all of the source files and deploys the results   \n' +
'                       to the build folder. If the "debugMode" sub target is    \n' +
'                       specified, or, the --debugMode option is specified, the  \n' +
'                       build will be executed without any optimization. In      \n' +
'                       addition to speeding up the build process, this option   \n' +
'                       has the effect of making the build artifact easier to    \n' +
'                       read and troubleshoot.                                   \n' +
'                                                                                \n' +
'   test:[client|     : Executes tests against source files or build artifacts.  \n' +
'         server|e2e]:  The type of test to execute is specified by the first    \n' +
'        [dev|build]    sub target (client/server/e2e), and the files to target  \n' +
'                       (dev/build) is specified by the second subtarget. The    \n' +
'                       first sub target is mandatory.                           \n' +
'                       If the "build" subtarget is specified, sources must      \n' +
'                       already be built and ready for testing int the build     \n' +
'                       directory.                                               \n' +
'                       If required by the tests, an instance of express will be \n' +
'                       started prior to executing the tests.                    \n' +
'                                                                                \n' +
'   bump:[major|minor]: Updates the version number of the package. By default,   \n' +
'                       this task only increments the patch version number. Major\n' +
'                       and minor version numbers can be incremented by          \n' +
'                       specifying the "major" or "minor" subtask.               \n' +
'                                                                                \n' +
' Supported Options:                                                             \n' +
'   --debugMode       : When set to true, forces builds to take place in debug   \n' +
'                       mode (no minification). This option overrides settings   \n' +
'                       from sub targets.                                        \n' +
'                                                                                \n' +
' IMPORTANT: Please note that while the grunt file exposes tasks in addition to  \n' +
' ---------  the ones listed below (no private tasks in grunt yet :( ), it is    \n' +
'            strongly recommended that just the tasks listed below be used       \n' +
'            during the dev/build process.                                       \n' +
'                                                                                \n' +
'--------------------------------------------------------------------------------';
module.exports = function(grunt) {
    /* ------------------------------------------------------------------------
     * Initialization of dependencies.
     * ---------------------------------------------------------------------- */
    //Time the grunt process, so that we can understand time consumed per task.
    require('time-grunt')(grunt);

    //Load all grunt tasks by reading package.json.
    require('load-grunt-tasks')(grunt);

    /* ------------------------------------------------------------------------
     * Build configuration parameters
     * ---------------------------------------------------------------------- */
    var packageConfig = grunt.file.readJSON('package.json') || {};

    var ENV = {
        appName: packageConfig.name || '__UNKNOWN__',
        appVersion: packageConfig.version || '__UNKNOWN__',
        tree: {                             /* ------------------------------ */
                                            /* <ROOT>                         */
            'app': {                        /*  |--- app                      */
                'static': {                 /*  |   |--- static               */
                    'css': null,            /*  |   |  |--- css               */
                    'js': null,             /*  |   |  |--- js                */
                    'img': null,            /*  |   |  |--- img               */
                    'lib': null             /*  |   |  |--- lib               */
                },                          /*  |   |                         */
                'views': null,              /*  |   |--- views                */
                'routes': null              /*  |   |--- routes               */
            },                              /*  |                             */
            'test': {                       /*  |--- test                     */
                'client': null,             /*  |   |--- client               */
                'e2e': null,                /*  |   |--- e2e                  */
                'server': null,             /*  |   |--- server               */
                'mocks': null               /*  |   |--- mocks                */
            },                              /*  |                             */
            'logs': null,                   /*  |--- logs                     */
            'working': {                    /*  |--- working                  */
                'app': {                    /*  |   |--- app                  */
                    'static': {             /*  |   |   |--- static           */
                        'css': null,        /*  |   |   |   |--- css          */
                        'js': null,         /*  |   |   |   |--- js           */
                        'img': null,        /*  |   |   |   |--- img          */
                        'lib': null         /*  |   |   |   |--- lib          */
                    },                      /*  |   |   |                     */
                    'views': null,          /*  |   |   |--- views            */
                    'routes': null          /*  |   |   |--- routes           */
                }                           /*  |   |                         */
            },                              /*  |   |                         */
            'coverage': null,               /*  |   |--- coverage             */
            'dist': null,                   /*  |   |--- dist                 */
            '.sass-cache': null,            /*  |   |--- .sass-cache          */
        }                                   /* ------------------------------ */
    };

    ENV.ROOT = _folder.createFolderTree('./', ENV.tree);
    ENV.bannerText = '/*! [' + ENV.appName + ' v' + ENV.appVersion +
                   '] Built: <%= grunt.template.today("yyyy-mm-dd HH:MM a") %> */\n';
    ENV.publishArchive = ENV.appName + '_' + ENV.appVersion + '.zip';

    // This is the root url prefix for the app, and represents the path
    // (relative to root), where the app will be available. This value should
    // remain unchanged for most apps, but can be tweaked here if necessary.
    ENV.appRoot = '/' + ENV.appName;
    (function _createTreeRefs(parent, subTree) {
        for(var folder in subTree) {
            var folderName = folder.replace('.', '_');
            parent[folderName] = parent.getSubFolder(folder);

            var children = subTree[folder];
            if(typeof children === 'object') {
                _createTreeRefs(parent[folder], children);
            }
        }
    })(ENV.ROOT, ENV.tree);

    // Shorthand references to key folders.
    var APP = ENV.ROOT.app;
    var TEST = ENV.ROOT.test;
    var LOGS = ENV.ROOT.logs;
    var DIST = ENV.ROOT.dist;
    var WORKING = ENV.ROOT.working;
    var BUILD = WORKING.app;

    var KARMA_PREPROC = {};
    KARMA_PREPROC[APP.static.js.getChildPath('**/*.html')] = 'ng-html2js';
    KARMA_PREPROC[APP.static.js.getChildPath('**/*.js')] = 'coverage';

    /* ------------------------------------------------------------------------
     * Grunt task configuration
     * ---------------------------------------------------------------------- */
    grunt.initConfig({
        /**
         * Configuration for grunt-contrib-clean, which is used to:
         *  - Remove temporary files and folders.
         */
        clean: {
            dist: [ DIST.getPath() ],
            working: [ WORKING.getPath() ],
            sassCache: [ ENV.ROOT['_sass-cache'].getPath() ],
            coverage: [ ENV.ROOT.coverage.getPath() ],
            logs: [ LOGS.getChildPath('*') ],
            workingJs: {
                src: [ BUILD.static.js.allFilesPattern() ],
                filter: function(path) {
                    return !path.match(/(app.min.js$)|(config.js$)|(require.js$)/);
                }
            },
            workingStyles: [
                            BUILD.static.css.allFilesPattern('scss'),
                            BUILD.static.css.allFilesPattern('css'),
                            '!' + BUILD.static.css.getChildPath('app.min.css')
                        ],
            workingLib: [
                            BUILD.static.lib.getPath() + '/*',
                            '!' + BUILD.static.lib.getChildPath('/requirejs'),
                            '!' + BUILD.static.lib.getChildPath('/bootstrap'),
                            BUILD.static.lib.getChildPath('/bootstrap/*'),
                            '!' + BUILD.static.lib.getChildPath('/bootstrap/dist')
                        ]
        },

        /**
         * Configuration for grunt-contrib-copy, which is used to:
         *  - Copy files to a distribution folder during build.
         */
        copy: {
            compile: {
                files: [ {
                    expand: true,
                    cwd: APP.getPath(),
                    src: ['**'],
                    dest: BUILD.getPath()
                }, {
                    expand: false,
                    cwd: ENV.ROOT.getPath(),
                    src: ['package.json'],
                    dest: WORKING.getPath()
                } ]
            }
        },

        /**
         * Configuration for grunt-contrib-concat, which is used to:
         *  - Combine one or more files into a single file.
         */
        concat: {
            options: {},
            css: {
                src: BUILD.static.css.allFilesPattern('css'),
                dest: BUILD.static.css.getChildPath('app.min.css')
            }
        },

        /**
         * Configuration for grunt-contrib-compress, which is used to:
         *  - Create compressed archives of build artifacts.
         */
        compress: {
            options: {},
            default: {
                options: {
                    mode: 'zip',
                    archive: DIST.getChildPath(ENV.publishArchive)
                },
                files: [ {
                    cwd: WORKING.getPath(),
                    // .ebextensions is for elastic beanstalk. If the directory
                    // does not exists, this will have no impact.
                    src: [ '**/*', '.ebextensions/*' ],
                    expand: true
                } ]
            }
        },

        /**
         * Configuration for grunt-karma, which is used to:
         *  - Execute unit tests against all client side javascript code
         */
        karma: {
            options: {
                preprocessors: KARMA_PREPROC,
                ngHtml2JsPreprocessor: {
                    stripPrefix: 'app/static',
                    prependPrefix: ENV.appRoot,
                    moduleName: '_testFixtureModule',
                    requireDeps: ['angular']
                },
                coverageReporter: {
                    type: 'text'
                },
                basePath: '',
                port: 9999,
                frameworks: ['mocha', 'requirejs', 'chai-sinon'],
                singleRun: true,
                autoWatch: false,
                background: false,
                logLevel: 'ERROR',
                browsers: ['PhantomJS'],
                reporters: ['mocha', 'coverage'],
                colors: true
            },
            dev: {
                options: {
                    files: [
                        TEST.client.getChildPath('test-loader.js'),
                        APP.static.js.allFilesPattern('html'),

                        { pattern: APP.static.lib.allFilesPattern('js'), included: false },
                        { pattern: APP.static.js.allFilesPattern(), included: false },
                        { pattern: TEST.client.allFilesPattern('js'), included: false },
                        { pattern: TEST.mocks.allFilesPattern(), included: false }
                    ]
                }
            },
            build: {
                options: {
                    files: [
                        TEST.client.getChildPath('test-loader.js'),
                        BUILD.static.js.getChildPath('app.min.js'),

                        // We're using the libraries from the app folder just
                        // to make sure that test dependencies (like angular-mocks)
                        // are loaded for testing. All of the core libraries will
                        // be minified and loaded from the compiled build file.
                        {
                            pattern: APP.static.lib.getChildPath('angular-mocks/angular-mocks.js'),
                            included: false
                        },
                        { pattern: BUILD.static.js.allFilesPattern('js'), included: false },
                        { pattern: TEST.client.allFilesPattern('js'), included: false },
                        { pattern: TEST.mocks.allFilesPattern(), included: false }
                    ]
                }
            },
        },

        /**
         * Configuration for grunt-mocha-test, which is used to:
         *  - Execute server side node.js tests
         *  - Test web server API by making http requests to the server
         */
        mochaTest: {
            options: {
                reporter: 'spec',
                timeout: 8000,
                colors: true
            },
            default: [ TEST.server.allFilesPattern('js') ]
        },

        /**
         * Configuration for grunt-protractor-runner, which is used to:
         *  - Execute end to end tests on the application.
         */
        protractor: {
            options: {
                keepAlive: false,
                noColor: false,
                args: {
                    // If the args are overridden in child targets, *all*
                    // properties of the args are overridden. It does not
                    // perform a merge.
                    framework: ['mocha'],
                    mochaOpts: {
                        reporter: 'spec',
                        slow: 2000,
                        timeout: 10000
                    },
                    browser: 'chrome',
                    baseUrl: 'http://localhost:3000',
                    specs: [ TEST.e2e.allFilesPattern('js') ],
                    exclude: [ TEST.e2e.getChildPath('conf/*') ],
                    chromeDriver: './node_modules/grunt-protractor-runner/node_modules/protractor/selenium/chromedriver'
                },
                configFile: TEST.e2e.getChildPath('conf/default.js')
            },
            default: {}
        },

        /**
         * Configuration for grunt-angular-templates, which is used to:
         *  - Compile all angular.js templates (html files) into .js files
         *  - Attach the compiled templates to a specified module.
         * NOTE: Every module included in the app must contain a corresponding
         * entry in this task to ensure that the templates are compiled.
         */
        ngtemplates: {
            options: {
                module: '',
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                // Wrap the compiled templates in an AMD wrapper.
                bootstrap: function(module, script) {
                    return 'define([\'angular\', \'./module\'],' +
                            'function(angular, module) { \n' +
                            'angular.module(module).run([\'$templateCache\', ' +
                            'function($templateCache) {\n' +
                            script +
                            '}]);\n});';
                },
                prefix: ENV.appRoot + '/',
            },
            helloWorldModule: {
                cwd: APP.static.getPath(),
                src: [ 'js/hello-world-module/*.html',
                        'js/hello-world-module/**/*.html' ],
                dest: BUILD.static.js.getChildPath('hello-world-module/templates.js')
            }
        },

        /**
         * Configuration for grunt-contrib-requiejs, which is used to:
         *  - Combine all AMD modules into a single, optimized javascript file.
         */
        requirejs: {
            compile: {
                options: {
                    mainConfigFile: BUILD.static.js.getChildPath('config.js'),
                    baseUrl: BUILD.static.getPath(),
                    name: 'js/app',
                    out: BUILD.static.js.getChildPath('app.min.js'),
                    preserveLicenseComments: false
                }
            }
        },

        /**
         * Configuration for grunt-contrib-compass, which is used to:
         *  - Convert all SASS files into css files.
         */
        compass: {
            options: {
                importPath: BUILD.static.css.getPath(),
                relativeAssets: true,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\n'
            },
            compile: {
                options: {
                    sassDir: BUILD.static.css.getPath(),
                    cssDir: BUILD.static.css.getPath()
                }
            }
        },

        /**
         * Configuration for grunt-contrib-cssmin, which is used to:
         *  - Combine and minify one or more css files into a single css file.
         */
        cssmin: {
            options: {
                banner: ENV.bannerText
            },
            compile: {
                src: BUILD.static.css.getChildPath('app.min.css'),
                dest: BUILD.static.css.getChildPath('app.min.css')
            }
        },

        /**
         * Configuration for grunt-jsbeautifier, which is used to:
         *  - Beautify all javascript, html and css files  prior to checkin.
         */
        jsbeautifier: {
            dev: [ APP.allFilesPattern('js'),
                    APP.static.css.allFilesPattern('css'),
                    APP.static.js.allFilesPattern('html'),
                    '!' + APP.static.js.getChildPath('require.js'),
                    '!' + APP.static.lib.allFilesPattern(),
                    TEST.allFilesPattern('js') ]
        },

        /**
         * Configuration for grunt-prettysass, which is used to:
         *  - Beautify all SASS files
         */
        prettysass: {
            options: {
                indent: 4
            },
            dev: {
                src: [ APP.static.css.allFilesPattern('scss') ]
            }
        },

        /**
         * Configuration for grunt-contrib-watch, which is used to:
         *  - Monitor all source/test files and trigger actions when these
         *    files change.
         */
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            dev: [ 'Gruntfile.js',
                    APP.allFilesPattern('js'),
                    '!' + APP.static.js.getChildPath('require.js'),
                    '!' + APP.static.lib.allFilesPattern(),
                    TEST.allFilesPattern('js') ]
        },

        /**
         * Configuration for grunt-contrib-watch, which is used to:
         *  - Monitor all source/test files and trigger actions when these
         *    files change.
         */
        watch: {
            allSources: {
                files: [ APP.allFilesPattern(), TEST.allFilesPattern() ],
                tasks: [ ]
            }
        },

        /**
         * Configuration for grunt-express-server, which is used to:
         *  - Start an instance of the express server for the purposes of
         *    running tests.
         */
        express: {
            options: {
                debug: true
            },
            dev: {
                options: {
                    node_env: 'dev',
                    script: APP.getChildPath('server.js')
                }
            },
            build: {
                options: {
                    node_env: 'test',
                    script: BUILD.getChildPath('server.js')
                }
            }
        },

        /**
         * Configuration for grunt-bump, which is used to:
         *  - Update the version number on package.json
         */
        bump: {
            options: {
                push: false
             }
        }
    });

    /* ------------------------------------------------------------------------
     * Task registrations
     * ---------------------------------------------------------------------- */

    /**
     * Default task. Performs default tasks prior to checkin, including:
     *  - Beautifying files
     *  - Linting files
     *  - Building sources
     *  - Testing build artifacts
     *  - Cleaning up build results
     */
    grunt.registerTask('default', [ 'jsbeautifier:dev',
                                    'prettysass:dev',
                                    'jshint:dev',
                                    'build',
                                    'test:client:build',
                                    'test:server:build',
                                    'test:e2e:build',
                                    'clean' ]);

    /**
     * Create distribution package task. Creates a new distribution of the app,
     * ready for deployment.
     */
    grunt.registerTask('package', ['jsbeautifier:dev',
                                 'prettysass:dev',
                                 'jshint:dev',
                                 'build',
                                 'test:client:build',
                                 'test:server:build',
                                 'test:e2e:build',
                                 'compress:default' ]);
    /**
     * Test task - executes client only tests, server only tests or end to end
     * tests based on the test type passed in. Tests may be executed against
     * dev code or build artifacts.
     */
    grunt.registerTask('test',
        'Executes tests (client/server/e2e) against sources or build artifacts',
        function(testType, target) {
            var testAction;
            var startServer = false;

            target = target || 'dev';

            if(testType === 'client') {
                if(target !== 'dev' && target !== 'build') {
                    grunt.log.warn('The target [' +
                                    target +
                                    '] is not applicable for client testing');
                } else {
                    testAction = 'karma:' + target;
                }
            } else if(testType === 'server') {
                testAction = 'mochaTest:default';
                startServer = true;
            } else if(testType === 'e2e') {
                testAction = 'protractor:default';
                startServer = true;
            }
            if(testAction) {
                if(startServer) {
                    grunt.task.run('express:' + target);
                }
                grunt.task.run(testAction);
            } else {
                grunt.log.warn('Unrecognized test type or target. Please see help (grunt help) for task usage information');
            }
        }
    );


    // Monitor task - track changes on different sources, and enable auto
    // execution of tests if requested.
    //  - If no arguments are specified, just launch web server with auto
    //    refresh capabilities.
    //  - If arguments are specified (see help) execute the necessary actions
    //    on changes.
    grunt.registerTask('monitor',
        'Monitors source files for changes, and performs actions as necessary',
        function() {
            var tasks = [];

            var serverMode = grunt.option('serverMode') || 'dev';
            // Process the arguments (specified as subtasks).
            for (var index = 0; index < arguments.length; index++) {
                var arg = arguments[index];
                var task = null;

                if (arg === 'lint') {
                    tasks.push('jshint:dev');

                } else if ('client' === arg) {
                    tasks.push('test:client:dev');

                } else if ('server' === arg) {
                    tasks.push('test:server:' + serverMode);

                } else if ('e2e' === arg) {
                    tasks.push('test:e2e:' + serverMode);

                } else if ('build' === arg) {
                    tasks.slice(0, 0);
                    tasks.push('jshint:dev');
                    tasks.push('build');
                    tasks.push('test:client:build');
                    tasks.push('test:server:build');
                    tasks.push('test:e2e:build');
                    break;

                } else {
                    // Unrecognized argument.
                    console.warn('Unrecognized argument: %s', arg);
                }
            }

            if(tasks.length > 0) {
                grunt.config.set('watch.allSources.tasks', tasks);
                grunt.log.writeln('Tasks to run on change: [' + tasks + ']');
                grunt.task.run('watch:allSources');
            } else {
                grunt.log.writeln('No tasks specified to execute on change');
            }
        }
    );

    /**
     * Build task - performs a compilation on all source files
     *  - Combines and compresses all client side .js files
     *  - Compiles angular.js html templates
     *  - Compiles all stylesheet files from .scss to .css
     */
    grunt.registerTask('build',
        'Performs a full build of all source files, preparing it for packaging/publication',
        function(target) {
            var isDebugMode = grunt.option('debugMode') || (target === 'debugMode');
            if(isDebugMode) {
                grunt.config.set('requirejs.compile.options.optimize', 'none');
                grunt.log.writeln('Executing build in debug mode');
            }

            grunt.task.run('clean:dist');
            grunt.task.run('clean:working');
            grunt.task.run('copy:compile');
            grunt.task.run('ngtemplates');
            grunt.task.run('requirejs:compile');
            grunt.task.run('compass:compile');
            grunt.task.run('concat:css');
            if(!isDebugMode) {
                grunt.task.run('cssmin:compile');
            }

            grunt.task.run('clean:workingJs');
            grunt.task.run('clean:workingStyles');
            grunt.task.run('clean:sassCache');
            grunt.task.run('clean:coverage');
            grunt.task.run('clean:workingLib');
        }
    );

    /**
     * Shows the environment setup.
     */
    grunt.registerTask('env',
        'Shows the current environment setup',
        function() {
            var separator = new Array(80).join('-');
            function _showRecursive(root, indent) {
                var indentChars = '  ';
                if(!indent) {
                    indent = 0;
                } else  {
                    indentChars += '|';
                }
                indentChars += new Array(indent).join(' ');
                indentChars += '|--- ';
                var hasChildren = false;
                for(var prop in root) {
                    var member = root[prop];
                    if(typeof member === 'object') {
                        var maxLen = 74 - (indentChars.length + prop.length);
                        var status = _utils.padLeft(member.getStatus(), maxLen);

                        grunt.log.writeln(indentChars + prop + status);
                        hasChildren = true;
                        if(_showRecursive(member, indent  + 4)) {
                            grunt.log.writeln('  |');
                        }
                    }
                }

                return hasChildren;
            }

            grunt.log.writeln('\n' + separator);
            _showRecursive(ENV.ROOT, 0);
            grunt.log.writeln(separator + '\n');
        }
    );

    /**
     * Shows help information on how to use the Grunt tasks.
     */
    grunt.registerTask('help',
        'Displays grunt help documentation',
        function(){
            grunt.log.writeln(HELP_TEXT);
        }
    );
};
