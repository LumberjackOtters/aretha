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

function testComposer(eventEmitter, options){

    console.log(chalk.yellow('Reading composer.lock'));

    var composerLock = file.readJsonFile('composer.lock');
    var composer = file.readJsonFile('composer.json');

    var packages = [];
    var infos = [];

    var infosSpinner = new Spinner('Getting Packages Info', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
    infosSpinner.start();

    for (let dependency of composerLock.packages) {
      infos.push(axios.get(packagist.getPackageInfosUri(dependency.name)));
    }

    let projectDelay = {'major':0, 'minor':0, 'patch':0, 'abandoned':0, 'unstable':0};

    axios.all(infos).then(function (results) {
          for (let result of results) {
              var packageInfos = result.data;
              packages[packageInfos.package.name] = packageInfos.package;
          }
      }).then(function(){
          infosSpinner.stop();

          for (let dependency of composerLock.packages) {
              var name = dependency.name;
              var range = null;
              if (options['respect-require']) {
                  range = composer.require[name];
              }

              var lastDependencyVersion = delay.getMaxVersion(Object.keys(packages[name].versions), range);

              if (dependency.abandoned) {
                  projectDelay.abandoned++;
                  eventEmitter.emit('abandoned', [name, dependency.abandoned]);
              }

              if (!delay.isStable(dependency.version)) {
                  projectDelay.unstable++;
                  eventEmitter.emit('unstable', [name, dependency.version]);
              }

              if (delay.isStable(dependency.version)) {
                  var versionCompare = delay.compareVersions(lastDependencyVersion, dependency.version);
                  switch (versionCompare) {
                      case null:
                          eventEmitter.emit('nodelay', name);
                          break;
                      default:
                          if (versionCompare.major) {
                              eventEmitter.emit('major', [name, versionCompare.major]);
                              projectDelay.major++;
                              break;
                          }
                          if (versionCompare.minor) {
                              eventEmitter.emit('minor', [name, versionCompare.minor]);
                              projectDelay.minor++;
                              break;
                          }
                          if (versionCompare.patch) {
                              eventEmitter.emit('patch', [name, versionCompare.patch]);
                              projectDelay.patch++;
                              break;
                          }
                  }
              }
          }

          delay.projectDelay(projectDelay, 'Composer');
      });
}


module.exports = {
  testComposer: testComposer
};
