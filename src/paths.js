const path = require('path');
const fs = require('fs');

class Site {
    constructor(path,actualpath) {
        this.path = path;
        this.actualpath = actualpath
        this.subsites = []
    }
}

exports.getSubFiles = getSubFiles
exports.parseJson = parseJsonSitePaths
// analyses folder and returns Site objects with their path and 
//subsites if a folder with the same name as the file is avaliable

function parseJsonSitePaths (jsonPath)  {
    var resultarray = []
    var files = []
    var directory = []
    var jsonarray = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    return jsonarray
}

function getSubFiles (startpath, pathToAdd)  {
    var resultarray = []
    var files = []
    var directory = []
    fs.readdirSync(startpath, { withFileTypes: true }).forEach(element => {
        if (element.isFile()) {
            if (path.extname(element.name) == ".html") {
                files.push(element)
            }
        }
        if (element.isDirectory()) {
            directory.push(element)
        }
    });
    files.forEach(file => {
        var site = new Site(path.join(pathToAdd, file.name),path.join(startpath, file.name))
        directory.forEach(dir => {
            if (dir.name == path.basename(file.name, path.extname(file.name))) {
                site.subsites = getSubFiles(path.join(startpath, dir.name), path.join(pathToAdd, dir.name))
            }
        })
        resultarray.push(site)
    })
   resultarray.sort((siteA, siteB) => { 
        if(siteA.path < siteB.path) { return -1; }
        if(siteA.path > siteB.path) { return 1; }
        return 0;
    })
    return resultarray
}
