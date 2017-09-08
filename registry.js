function getPackageInfosUri(dependency) {
    return "http://registry.npmjs.org/" + dependency;
}

module.exports = {
  getPackageInfosUri: getPackageInfosUri
};
