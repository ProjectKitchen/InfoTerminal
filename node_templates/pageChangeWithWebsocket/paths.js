const path = require('path');
const fs = require('fs');

class Site {
    constructor(path) {
        this.path = path;
        this.subsites = []
    }
}

// analyses folder and returns Site objects with their path and 
//subsites if a folder with the same name as the file is avaliable
exports.getSubFiles = function (startpath) {
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
        var site = new Site(path.join(startpath, file.name))
        directory.forEach(dir => {
            if (dir.name == path.basename(file.name, path.extname(file.name))) {
                site.subsites = exports.getSubFiles(path.join(startpath, dir.name))
            }
        })
        resultarray.push(site)
    })
    return resultarray
}
