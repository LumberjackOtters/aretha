#!/usr/bin/env node

var chalk        = require('chalk');
var clear        = require('clear');
var CLI          = require('clui');
var figlet       = require('figlet');
var parseArgs    = require('minimist');
var Spinner      = CLI.Spinner;
var path         = require('path');
var axios        = require('axios');
var file         = require('./file.js');
var packagist    = require('./packagist.js');
var delay        = require('./delay.js');
var EventEmitter = require('events');
var events       = require('./events.js');
var composer     = require('./composer.js');
var yarn         = require("./yarn.js");

var args = process.argv.slice(2);
var options = parseArgs(args, {'default': {
    'max-delay': 'abandoned',
    'max-count': 0,
    'info-only': false,
    'verbose'  : false,
    'require-only': false,
}});

options['max-delay'] = events.delayValue(options['max-delay']);

// clear();
console.log(
  chalk.blue(
    figlet.textSync('Seeya', { horizontalLayout: 'full' })
  )
);

var eventEmitter = new EventEmitter();
events.subscriber(eventEmitter, options);

if (file.fileExists('composer.lock')) {
    composer.testComposer(eventEmitter, options);
}else{
    console.log(chalk.red('No composer'));
}

if (file.fileExists('yarn.lock')) {
    yarn.testYarn(eventEmitter, options);
}else{
    console.log(chalk.red('No yarn'));
}
