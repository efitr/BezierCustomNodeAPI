const dotenv = require('dotenv').config();
//To allow the routes to be made
const express = require('express');
//To allow the templating engine to work
const bodyParser = require('body-parser');
//validates and sanitises strings inputs
const expressValidator = require('express-validator');
//You can't DELETE or PUT without this npm module
//This overrides specifically the request, and need to be before the body of the request
const methodOverride = require('method-override');

var cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(expressValidator()); // Add after body parser initialization!
app.use(methodOverride('_method'));
app.use(cookieParser());

var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
    console.log("Authenticated")
  }
  next();
};
app.use(checkAuth);

//Database
const mongoWrapperMongoose = require('./data/reddit-db.js')
//Controllers
const posts = require('./controllers/posts.js')(app)

const auth = require('./controllers/auth.js')(app)

const port = 3000;

app.listen(port, function(){
  console.log('Server started on port' +port);
});

