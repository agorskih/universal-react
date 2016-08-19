var express     = require('express');
//var app         = express();
//var mongoose    = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
//var User   = require('./app/models/user'); // get our mongoose model

var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
//mongoose.connect(config.database); // connect to database

var routes = express.Router();

var db = require('express-cassandra');

//Tell express-cassandra to use the models-directory, and
//use bind() to load the models using cassandra configurations.

//If your keyspace doesn't exist it will be created automatically
//using the default replication strategy provided here.

//If dropTableOnSchemaChange=true, then if your model schema changes,
//the corresponding cassandra table will be dropped and recreated with
//the new schema. Setting this to false will send an error message
//in callback instead for any model attribute changes.
//
//If createKeyspace=false, then it won't be checked whether the
//specified keyspace exists and, if not, it won't get created
// automatically.
db.setDirectory( __dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: ['127.0.0.1'],
            protocolOptions: { port: 9042 },
            keyspace: 'thc',
            queryOptions: {consistency: db.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            dropTableOnSchemaChange: true, //recommended to keep it false in production, use true for development convenience.
            createKeyspace: true
        }
    },
    function(err) {
        if(err) console.log(err.message);
        else console.log(db.timeuuid());
    }
);

// basic route
routes.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

routes.get('/setup', function(req, res) {

  /*
  // create a sample user
  var testUser = new User({
    name: 'Jim Garcia',
    password: 'password',
    admin: true
  });

  // save the sample user
  testUser.save(function(err) {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({ success: true });
  });
  */
  var jim = new db.instance.User({name: "Jim", password: "password", admin: false});
  jim.save(function(err){
      if(err) console.log(err);
      else {
        console.log('User save successfully');
        res.json({ success: true });
      }
  });
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
routes.post('/authenticate', function(req, res) {

  /*
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        //var token = jwt.sign(user, app.get('superSecret'),
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 60 // expires in 1 hour
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
  */
  db.instance.User.findOne({name: req.body.name}, function(err, user){
    if(err) throw err;

    //Note that returned variable john here is an instance of your model,
    //so you can also do john.delete(), john.save() type operations on the instance.
    //console.log('Found ' + john.name + ' to be ' + john.age + ' years old!');

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        //var token = jwt.sign(user, app.get('superSecret'),
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 60 // expires in 1 hour
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
});
});

// route middleware to verify a token
routes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    //jwt.verify(token, app.get('superSecret'), function(err, decoded)
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

// route to show a random message (GET http://localhost:8080/api/)
routes.get('/api', function(req, res) {
  //res.json({ message: 'Welcome to the coolest API on earth!' });
  res.json({ admin: req.decoded.admin });
});

// route to return all users (GET http://localhost:8080/api/users)
routes.get('/users', function(req, res) {
  /*
  User.find({}, function(err, users) {
    res.json(users);
  });
  */
  db.instance.User.find({}, function(err, users){
    res.json(users);
  });
});

module.exports = routes;
