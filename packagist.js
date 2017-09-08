function getPackageInfosUri(dependency) {

    return "https://packagist.org/packages/" + dependency + ".json";
}

module.exports = {
  getPackageInfosUri: getPackageInfosUri
};
