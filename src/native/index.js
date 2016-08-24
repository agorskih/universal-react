/* eslint-disable no-console, react/require-extension */
// Bootstrap environment
require('react-native-browser-polyfill');

// github.com/facebook/react-native/issues/9093
// Will be removed in two weeks.
console.ignoredYellowBox = [
  'Warning: You are manually calling a React.PropTypes validation',
];

// global.Intl Polyfill
// Server polyfillLocales doesn't work anymore, because packager error:
// Encountered an error while persisting cache:
// > Error: TimeoutError: transforming /Users/este/dev/este/node_modules
// /intl/locale-data/complete.js took longer than 301 seconds.
// require('../server/intl/polyfillLocales')(
//   self,
//   require('./initialState.js').locales
// );
// Workaround:
// Remove "require('./locale-data/complete.js');" from node_modules/intl/index
// We can't change that code, but we can reimplement it easily.
// Expose `IntlPolyfill` as global to add locale data into runtime later on.
global.IntlPolyfill = require('../../node_modules/intl/lib/core.js');

global.Intl = global.IntlPolyfill;
global.IntlPolyfill.__applyLocaleSensitivePrototypes();
// App locales are defined in src/server/config.js
require('../../node_modules/intl/locale-data/jsonp/en.js');
require('../../node_modules/intl/locale-data/jsonp/es.js');

const en = require('react-intl/locale-data/en');
const es = require('react-intl/locale-data/es');
const { addLocaleData } = require('react-intl');

[en, es].forEach(locale => addLocaleData(locale));

// TODO: Consider.
// self.Promise = require('../common/configureBluebird');
require('./main');
