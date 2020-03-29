//
// Demo Blog for the Project Kitchen
// could be used as a base for a content management tool for the InfoTerminal
//
// based upon https://vegibit.com/node-js-blog-tutorial/
// see also: https://expressjs.com/de/guide/using-middleware.html
//

const path = require('path');
const express = require('express');
const expressEdge = require('express-edge'); 
const edge = require("edge.js");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Post = require('./database/models/Post');
const fileUpload = require("express-fileupload");
const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const connectFlash = require("connect-flash");
 
const createPostController = require('./controllers/createPost');
const homePageController = require('./controllers/homePage');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const createUserController = require('./controllers/createUser');
const storeUserController = require('./controllers/storeUser');
const loginController = require('./controllers/login');
const loginUserController = require('./controllers/loginUser');
const logoutController = require("./controllers/logout");
const checkStorePost = require('./middleware/storePost')
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated')

const app = new express(); 

mongoose.connect('mongodb://localhost:27017/node-blog-db', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err)); 

const mongoStore = connectMongo(expressSession);

app.use(function (req, res, next) {
  console.log('Time:', Date(Date.now()).toLocaleString().split(',')[0], 
  "request:", req.method, req.params, req.originalUrl);
  
  next();
});
 
app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(connectFlash());
app.use(fileUpload());
app.use(express.static('public')); // , {extensions: ['html', 'htm']}
app.use(expressEdge.engine);

app.set('views', __dirname + '/views');
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/posts/store', checkStorePost)

app.get('/index.html', (req, res) => {
    console.log("redirect to root");
    res.redirect('/');
})

app.get('/about.html', (req, res) => {
    res.render('about');
})
 
app.get('/contact.html', (req, res) => {
    res.render('contact');
});

app.get('/favicon.ico', (req, res) => {
    console.log("favicon requested");
    res.sendFile(path.resolve(__dirname, 'public/img/favicon.ico'));
});


//app.get("/posts/new", auth, createPostController);
app.get("/posts-new", auth, createPostController);

//app.get("/auth/register", createUserController);
app.get("/auth-register", redirectIfAuthenticated, createUserController);
app.post("/users/register", redirectIfAuthenticated, storeUserController);

//app.get('/auth/login', loginController);  
app.get('/auth-login', redirectIfAuthenticated, loginController);  
app.post('/users/login', redirectIfAuthenticated, loginUserController);

app.get("/auth-logout", logoutController);

app.get("/", homePageController);
app.get("/:id", getPostController);
app.post("/posts/store", storePostController); 


app.listen(4000, () => {
    console.log('App listening on port: 4000')
});
 