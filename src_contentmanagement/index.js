const express = require('express');
const app = express();
const { check, validationResult, body } = require('express-validator');
const path = require('path');

var fs = require('fs');
var bodyParser = require('body-parser')
var storage
const multer = require('multer')

const CONTENT_PASSWORD = "PASS"

app.use('/', express.static('./public'));
app.use('/upload', express.static('./upload'));

var jsonPath = "../src/sitespaths.json"
var contentfolderPath = "../webpages/"
var indextemplatePath = './newsites/indextemplate.html'

app.get("/jsonsites", (req, res) => {
    var jsonarray = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    res.send(jsonarray)
})

app.post("/deleteSide", bodyParser.urlencoded({ extended: true }), (req, res) => {
    let password = req.body.password
    if(password !== CONTENT_PASSWORD){
        deleteFolderContent("./upload")
        return res.status(401).end()
    }
    let sidePath = req.body.sidePathToDelete
    let menuselect = req.body.menuselect
    deleteSide(sidePath, menuselect)
    return res.end()
})

storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'_'+file.originalname)
    }
  })
 const addSide = multer({ storage: storage, preservePath: true });
app.post('/newsite', addSide.array("picture[]", 4),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        var password = req.body.password
        if(password !== CONTENT_PASSWORD){
            deleteFolderContent("./upload")
            
            return  res.redirect("/index.html?error=err").
            res.status(401).end()
        }
        var filename = req.body.filename
        var title = req.body.title
        var text = req.body.text
        var menuselect = req.body.menu
        var order = req.body.order
        var date = new Date()
        console.log(menuselect)
        var finishedFilename = filename + "_"  + date.getTime() + '.html'
        var finishedFilePath = contentfolderPath+ menuselect.substring(0, menuselect.length - 5)+ "/" + finishedFilename
        finishedFilename = menuselect.substring(0, menuselect.length - 5) + "\\" + finishedFilename
        var imagepaths = []
        
        req.files.forEach(element => {
            imagepaths.push(
                {
                   newpath : contentfolderPath+ menuselect.substring(0, menuselect.length - 5)+ "/"+ element.filename,
                    oldpath: element.path,
                    contentpath: "/"+menuselect.substring(0, menuselect.length - 5)+ "/"+ element.filename,
                    filename: element.filename
                }
            )
        });
        fs.readFile(indextemplatePath, 'utf-8', function (err, data) {
            if (err) throw err;

            var images = "";
            if(imagepaths.length > 0){
                imagepaths.forEach((paths) => {
                    fs.rename(paths["oldpath"], paths["newpath"], function (err) {
                        if (err) throw err
                        console.log('Successfully moved file!')
                    })
                    images += '<img src="' + paths["contentpath"] + '" alt="' + paths["filename"] + '" >'
                })
                images =  '<div class="picture">' + images + '</div>'
            }
            var newValue = data.replace('<h1 class="title">', ' <h1 class="title">' + title)
                .replace('<p class="text">', '<p class="text">' + text)
                .replace('<div class="picture"></div>', images);

            fs.writeFile(finishedFilePath, newValue, { encoding: 'utf-8', flag: 'w' }, function (err, data) {
                if (err) throw err;

                var jsonarray = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
                jsonarray.forEach((value) => {
                    if (value.path == menuselect) {
                        var newSite = new Site(finishedFilename)
                        value.subsites.splice(order, 0, newSite);
                        fs.writeFile(jsonPath, JSON.stringify(jsonarray), { encoding: 'utf-8', flag: 'w' }, function (err, data) {
                            if (err) throw err;
                            res.redirect("/")
                            res.end()
                        })
                    }
                })
            })
        })

    });
var port = 7070
const server = app.listen(port, function () {
    console.log('App listening on port ' + port +'!');
});

function deleteSide(sidePath, menuselect) {
    var jsonarray = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    jsonarray.forEach((menuSide, menuIndex) => {
        if (menuSide.path == menuselect) {
            menuSide.subsites.forEach((side, sideIndex) => {
                if (side.path == sidePath) {
                    deleteFilesFromSide(side)
                    delete jsonarray[menuIndex].subsites[sideIndex]
                    jsonarray[menuIndex].subsites = jsonarray[menuIndex].subsites.filter(function (element) {
                        return element != null;
                    });
                }
            })
        }
    })
    fs.writeFile(jsonPath, JSON.stringify(jsonarray), { encoding: 'utf-8', flag: 'w' }, function (err, data) {
        if (err) throw err;
    })
}

function deleteFilesFromSide(side){
    var imagePathsToDelete = []
    var content = fs.readFileSync(contentfolderPath+ side.path, 'utf-8')
    var indices = getIndicesOf('<img src="', content, true)
    indices.forEach(index => {
        let imagePathDelete = content.substring(
            content.indexOf('"',index+1)+1,
            content.indexOf('"', content.indexOf('"',index+1)+1)
            )
            imagePathsToDelete.push(imagePathDelete)
    })
    imagePathsToDelete.forEach(path => {
        fs.unlinkSync(contentfolderPath+ path)
    })
    fs.unlinkSync(contentfolderPath+ side.path)
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function deleteFolderContent(folderpath){
    fs.readdir(folderpath, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(path.join(folderpath, file), err => {
            if (err) throw err;
          });
        }
      });
}

class Site {
    constructor(path) {
        this.path = path;
        this.subsites = []
        this.nixitubes = ""
    }
}
