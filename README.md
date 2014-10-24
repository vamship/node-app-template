[![Build Status](https://travis-ci.org/vamship/app-template.svg?branch=master)](https://travis-ci.org/vamship/app-template)
## App Template

This is a sample application template, for web applications that run on the [Node JS](http://nodejs.org) platform. This template uses the following technologies:

###Application Tools
* [Node JS](http://nodejs.org/): Core platform; engine on which all server side code executes
* [Express JS](http://expressjs.com/): Web server (dynamic pages, web services)
    * [Jade Templating](http://jade-lang.com/): Templating language used to generate dynamic pages 
* [Require JS](http://requirejs.org): Client side file dependency management framework
* [Angular JS](https://angularjs.org/): Client side application development framework
* [Bootstrap](http://getbootstrap.com/): Core styles for responsive elements
* [UI Bootstrap](http://angular-ui.github.io/bootstrap/): Angular JS directives that leverage Bootstrap styles


###Development Tools
* [npm](https://www.npmjs.org/): Server side package manager. Manages server side dependencies (node modules).
* [bower](http://bower.io): Client side dependency manager. Helps download client side libraries for the project
* [grunt](http://gruntjs.com/): Javascript task automater. Used to automate common development tasks - builds, tests, etc.

###Project Structure
The project has the following structure.

```
<ROOT>
 |--- server            [Server side files]
 |   |--- views         [Views (jade templates)]
 |   |--- routes        [Express.js route definitions]
 |
 |--- client            [All client side resources (styles/scripts/images/etc.)]
 |   |--- css           [Stylesheets - regular css or sass (.css/.scss)]
 |   |--- js            [Javascript files (.js)]
 |   |--- img           [Images]
 |   |--- lib           [Third party libraries js/css/fonts/etc; managed via bower]
 |
 |--- test              [Test files]
 |   |--- spec          [Unit test files]
 |   |--- e2e           [End to end test files]
 |   |--- mocks         [Mocks created to support testing]
 |
 |--- logs              [Directory for log files]
 |
 |--- Gruntfile.js      [Grunt configuration file - provides basic tasks]
 |--- package.json      [Package configuration file - basic app info; node dependencies]
 |--- bower.json        [Client side dependency configuration file]
 |--- .bowerrc          [Configures bower behavior]
 |--- .jshintrc         [Configuration file containing JavaScript linting settings]
 |--- .gitignore        [List of files to be ignored by git]

```
The application and test code is completely self contained within the `server`, `client` and `test` directories respectively. All files under `client` are client side files that are loaded and executed on the browser. All other JavaScript files are intended to run on the server.

##RequireJS & AngularJS
The project template is designed to use both RequireJS and AngularJS on the client side. While AngularJS provides a [dependency injection](https://docs.angularjs.org/guide/di) mechanism to manage dependencies between entities, it expects that all of the dependencies are loaded and available on the page. If we assume that each entitiy is contained in a single file, it will then be up to the developer to ensure that all required files have been included on the page using `<script />` tags.

RequireJS alleviates the issues relating to the management of file dependencies by providing an [Asynchronous Module Definition](https://github.com/amdjs/amdjs-api/wiki/AMD) implementation that allows individual modules to define the files that it depends on for execution. This means that the developer only needs to take into account the immediate dependencies for a given file, and once these dependencies have been specified, RequireJS ensures that the entities are available on the page. RequireJS also ensures that the necessary depndencies are seamlessly loaded when all of the files have been combined into a single minified file, as is commonly the case in production deployments.

On the flip side, the use of RequireJS means that additional configuration is required for things such as - management of non AMD files, module definitions, etc. While the cost of creating and managing the configuration is worth the benefit that the paradigm brings to the table, it is nevertheless a task that the developer has to perform during the development process.

Currently, there are separate configuration files for:
* Normal application execution (`client/js/config.js`)
* Application build (`client/js/config.build.js`)
* Unit testing (`test/spec/spec-loader.js`)

**NOTE:** All three configuration files must be updated when new resources (third party libs) or modules are added to the project. 

### Modules
AngularJS uses the concept of modules as a grouping mechanism of logically related entities. RequireJS supports a similar grouping mechansim (also referred to as modules) for grouping related files together.

In the specific scenario of this project template, it makes sense to use RequireJS modules to store all files related to a single AngularJS module. This essentially translates to the following conventions:
* All files related to an AngularJS module are stored in a folder that has the following naming convention `<module name>-module` The `<module name>` is a hyphenated string that concisely describes the module.
* Each module folder contains the following files:
    * `main.js`: This file is the entry point for the module, and will be loaded first when the module is loaded. Given that it is loaded first, it is important that this file in turn specify all module files as dependencies, ensuring that those files are loaded as well.
    * `module.js`: This file contains the AngularJS module definition, and is in turn the most important dependency for all other files in the module.
    * All other entities are defined in separately, one per file.
* Each file is defined as an AMD module, which means that a return value is typically expected after the definition is executed. This template adopts the convention that each AMD module return a string that is the name of the AngularJS entity defined in the module.
* Each module in turn contains a `path` entry in the RequireJS configuration that uses a non hyphenated, camel cased naming convention. Thus, a module folder named `hello-world-module` can be referenced as `helloWorldModule` once an apporpriate path entry has been created.

##Usage

###Cloning
This template may be used by cloning the repository and subsequently pointing the cloned version to an upstream remote repository.

Given that this is a starter template, it is optimal if the repository is cloned with no history by executing
```
git clone <url> --depth 0
```
Once the template has been cloned, the upstream repo that this project points to may be changed by executing
```
git remote remove origin
git remote add origin <url>
```
Alternately, the developer can choose to delete the `.git` directory, and reinitialize git by executing:
```
rm -rf .git
git init
```

###Gruntfile
This project template is provided with a Gruntfile that contains task definitions for most common development activities. This includes - linting, testing (spec and e2e), building, and bumping version numbers. It is strongly recommended that the tasks defined in the Gruntfile be leveraged to the maximum extent possible. More information can be obtained by typing:
```
grunt help
```
