var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var routes = require('./routes');

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

var config = require('./config'); // get our config file
/*
var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('./app/models/user'); // get our mongoose model
mongoose.connect(config.database); // connect to database
*/
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use('/', routes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
