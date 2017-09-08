var chalk        = require('chalk');
var clear        = require('clear');
var CLI          = require('clui');
var figlet       = require('figlet');
var parseArgs    = require('minimist');
var Spinner      = CLI.Spinner;
var path         = require('path');
var axios        = require('axios');
var file         = require('./file.js');
var delay        = require('./delay.js');
var EventEmitter = require('events');
var events       = require('./events.js');
var registry     = require('./registry.js');
var yarn         = require("./node_modules/yarn/lib/lockfile/wrapper");

function yarnMatch(object, packageName) {
    for (var key in object) {
        if (key.match(new RegExp( packageName + '@'))) {
            return key;
        }
    }
    return null;
}

function testYarn(eventEmitter, options) {
    var dir = process.cwd();

    yarn.default.fromDirectory(dir).then((lockfile) => {
      if (!lockfile.cache) {
        throw "yarn.lock could not be found or loaded";
      }

      var packageJson = file.readJsonFile('package.json');

      let npmPackages  = [];
      npmPackages = Object.keys(lockfile.cache).map(function(key){

        return {'name' : key.split('@')[0], 'info' : lockfile.cache[key]};

      });

      let packages = [];
      let infos = [];

      var infosSpinner = new Spinner('Getting Packages Info', ['⣾','⣽','⣻','⢿','⡿','⣟','⣯','⣷']);
      infosSpinner.start();

      for (let dependency of npmPackages) {
        dependencyName = dependency.name;
        infos.push(axios.get('http://registry.npmjs.org/' + dependencyName));
      }

      let projectDelay = {'major':0, 'minor':0, 'patch':0, 'abandoned':0, 'unstable':0};

      axios.all(infos).then(function (results) {
            for (let result of results) {
                var packageInfos = result.data;

                packages[packageInfos.name] = packageInfos;
            }
        }).then(function(){
            infosSpinner.stop();
            for (let dependency of npmPackages) {

                var name = dependency.name;
                var range = null;

                if (options['respect-require']) {
                    range = packageJson.dependencies[name];
                }

                var lastDependencyVersion = packages[name]['dist-tags'].latest;

                var deprecate = packages[name]['versions'][dependency.info.version].deprecated;
                if ( deprecate ) {
                    projectDelay.abandoned++;
                    eventEmitter.emit('abandoned', [name, deprecate]);
                }

                if (!delay.isStable(dependency.info.version)) {
                    projectDelay.unstable++;
                    eventEmitter.emit('unstable', [name, dependency.info.version]);
                }

                if (delay.isStable(dependency.info.version)) {
                    var versionCompare = delay.compareVersions(lastDependencyVersion, dependency.info.version);
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
            delay.projectDelay(projectDelay, 'Yarn');
      });

    }).catch((err) => {
      throw err;
    });
}

module.exports = {
  yarnMatch: yarnMatch,
  testYarn: testYarn
};
