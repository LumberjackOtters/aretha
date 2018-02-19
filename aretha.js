#!/usr/bin/env node

var chalk        = require('chalk');
var clear        = require('clear');
var CLI          = require('clui');
var figlet       = require('figlet');
var parseArgs    = require('minimist');
var file         = require('./file.js');
var delay        = require('./delay.js');
var EventEmitter = require('events');
var events       = require('./events.js');
var composer     = require('./composer.js');
var yarn         = require("./yarn.js");
var extend = require('util')._extend


var args = process.argv.slice(2);
var options = parseArgs(args, {'default': {
    'max-delay': 'abandoned',
    'max-count': 0,
    'info-only': false,
    'verbose'  : false,
    'require-only': false,
}});

if (file.fileExists('.aretha.yml')) {
    var optionsFile = file.readYamlFile('.aretha.yml');
    options = extend(options,optionsFile);
}

options['max-delay'] = events.delayValue(options['max-delay']);

// clear();
console.log(
  chalk.blue(
    figlet.textSync('Aretha', { horizontalLayout: 'full' })
  )
);

var eventEmitter = new EventEmitter();
events.subscriber(eventEmitter, options);

if (file.fileExists('composer.lock')) {
    composer.testComposer(eventEmitter, options);
}else{
    console.log(chalk.blue('No composer'));
}

if (file.fileExists('yarn.lock')) {
    yarn.testYarn(eventEmitter, options);
}else{
    console.log(chalk.blue('No yarn'));
}
