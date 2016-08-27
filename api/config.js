// www.andrewsouthpaw.com/2015/02/08/environment-variables/
var nconf = require('nconf');

// Use less-terrible separator character, stackoverflow.com/questions/25017495
nconf.env('__');

nconf.file('config.json');

// Remember, never put secrets in the source code. Use environment variables for
// production or src/common/config.json for development instead.
nconf.defaults({
  apiName: 'universal-react-api',
  db: {
    url: '',
  },
  isProduction: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 3001,
  secret: '',
});

module.exports = nconf.get();
