let chalk               = require('chalk');
let semverStable        = require('semver-stable');
let semverUtils         = require('semver-utils');
let semver              = require('semver');


function compareVersions(v1, v2) {
    if (!semver.diff(v1, v2)) {
        return null;
    }

    v1 = semverUtils.parse(v1);
    v2 = semverUtils.parse(v2);

    return {
        'major': v1.major - v2.major,
        'minor': v1.minor - v2.minor,
        'patch': v1.patch - v2.patch
    };
}

function getMaxVersion(versions, range) {

    if (range == null) {
        range = ">0.0.0";
    }

    versions = versions.filter(function (version) {
      return semverStable.is(version);
    });

    return semver.maxSatisfying(versions, range);
}

function isStable(version) {
    return semverStable.is(version);
}

function projectDelay(delay, projectName = null) {
    console.log(chalk.white(projectName + ' Project Total Delay :'));
    var projetDelayScreen = null;
    switch (delay) {
        case null:
            console.log(chalk.green('No Delay'));
            break;
        default:
            if (delay.abandoned) {
                console.log(chalk.red('Abandoned:    ' + delay.abandoned));
            }
            if (delay.major) {
                console.log(chalk.red('Major:    ' + delay.major));
            }
            if (delay.minor) {
                console.log(chalk.yellow('Minor:    ' + delay.minor));
            }
            if (delay.patch) {
                console.log(chalk.green('Patch:    ' + delay.patch));
            }
    }
}

module.exports = {
  projectDelay: projectDelay,
  compareVersions: compareVersions,
  getMaxVersion : getMaxVersion,
  isStable : isStable
};
