var fs          = require('fs');
var yaml        = require('js-yaml');

function fileExists(filePath) {
    // var basePath = path.basename(process.cwd());
    try {
        return fs.existsSync(filePath);
    } catch (err) {
        return false;
    }
}

function readJsonFile(path) {
    return JSON.parse(fs.readFileSync(path));
}

function readYamlFile(path) {
    return yaml.safeLoad(fs.readFileSync(path));
}

module.exports = {
  fileExists: fileExists,
  readJsonFile: readJsonFile,
  readYamlFile: readYamlFile
};
