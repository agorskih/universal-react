/* eslint-disable react/require-extension */
// Bootstrap environment

const onWindowIntl = () => {
  require('babel-polyfill');
  window.Promise = require('../common/configureBluebird');

  // App locales are defined in src/server/config.js
  const { addLocaleData } = require('react-intl');
  const en = require('react-intl/locale-data/en');
  const es = require('react-intl/locale-data/es');

  [en, es].forEach(locale => addLocaleData(locale));

  require('./main');
};

// github.com/andyearnshaw/Intl.js/#intljs-and-browserifywebpack
if (!window.Intl) {
  require.ensure([
    'intl',
    'intl/locale-data/jsonp/en.js',
    'intl/locale-data/jsonp/es.js',
  ], (require) => {
    require('intl');
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/es.js');

    onWindowIntl();
  });
} else {
  onWindowIntl();
}
