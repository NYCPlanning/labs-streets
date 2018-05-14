var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var helpers = require('broccoli-kitchen-sink-helpers');
var changeCase = require('change-case');

var Plugin = require('broccoli-plugin');

module.exports = Merger;
Merger.prototype = Object.create(Plugin.prototype);
Merger.prototype.constructor = Merger;

function Merger (inputNode, options) {
  if (!(this instanceof Merger)) return new Merger(inputNode, options);
  Plugin.call(this, [inputNode]);
  this.options = options || {};
}

Merger.prototype.build = function() {
  var sourcePath = this.inputPaths[0];
  var destPath   = path.join(this.outputPath, this.options.destDir);

  if (destPath[destPath.length -1] === '/') {
    destPath = destPath.slice(0, -1);
  }

  if (!fs.existsSync(destPath)) {
    mkdirp.sync(destPath);
  }

  var subDirNames = fs.readdirSync(sourcePath).filter(function(d) {
    var stats = fs.statSync(path.join(sourcePath, d));
    return d[0] != '.' && stats.isDirectory(); // exclude anything that starts with a . and isn't a directory
  });

  subDirNames.forEach(function(subDirName) {
    var outputFile = path.join(destPath, subDirName + '.json');
    var filesDir = path.join(sourcePath, subDirName);

    var inputFiles = helpers.multiGlob(['**/*.json'], {cwd: filesDir})

    var output = [];
    inputFiles.forEach(function(inputFile) {
      var parts = inputFile.split("/");
      var fileContent = JSON.parse(fs.readFileSync(path.join(filesDir, inputFile)));
      parts[parts.length - 1] = path.basename(parts[parts.length - 1], '.json');
      output.push(fileContent);
    });
    fs.writeFileSync(outputFile, JSON.stringify(output));
  });
}
