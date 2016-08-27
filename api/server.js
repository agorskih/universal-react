/*
import auth from './auth';
import bodyParser from 'body-parser';
import config from './config';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', auth);

app.listen(config.port, () => {
  console.log(`API Server started at http://localhost:${config.port}`);
});
*/
var auth = require('./auth');
var bodyParser = require('body-parser');
var config = require('./config');
var cors = require('cors');
var express = require('express');

var app = express();

app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', auth);

app.listen(config.port, function() {
  console.log('API Server started at http://localhost:' + config.port);
});

/*
var morgan = require('morgan');
var routes = require('./routes');

var mongoose    = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User   = require('./app/models/user'); // get our mongoose model
mongoose.connect(config.database); // connect to database
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use('/', routes);
*/
