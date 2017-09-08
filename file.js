var fs          = require('fs');

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

module.exports = {
  fileExists: fileExists,
  readJsonFile: readJsonFile
};
