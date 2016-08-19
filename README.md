# universal-react

> One stack for browser, server, mobile

## Techniques

- Truly universal architecture
  - code shared across platforms (browser, server, native mobile)
  - server side rendering
  - universal data fetching (unique approach without react-router)
  - an optional rendering to HTML files (for static hostings)
  - universal internationalization with runtime language switching
  - universal crash reporting via Sentry
  - universal forms with universal validation (universal ftw, yeah)
- Immutable app state
- API server backend
  - email and facebook login
  - declarative queryApi higher order component
  - user presence

## Libraries

- [react](http://facebook.github.io/react/) and [react native](https://facebook.github.io/react-native/)
- [redux](http://rackt.github.io/redux/)
- [babeljs](https://babeljs.io/)
- [immutablejs](http://facebook.github.io/immutable-js)
- [react-router](https://github.com/rackt/react-router)
- [react-router-redux](https://github.com/reactjs/react-router-redux)
- [react-intl](https://github.com/yahoo/react-intl)
- [redux-storage](https://github.com/michaelcontento/redux-storage)
- [webpack](http://webpack.github.io/)
- [expressjs](http://expressjs.com/)
- [eslint](http://eslint.org/)
- [formatjs](http://formatjs.io/) Universal internationalization.
- [react-helmet](https://github.com/nfl/react-helmet) A document head manager for React.
- [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools)
- [chriso/validator.js](https://github.com/chriso/validator.js) For simple yet powerfull Este sync/async validation.
- [bluebird](https://github.com/petkaantonov/bluebird) Because it's better than native implementation.
- [AVA](https://github.com/avajs/ava) Futuristic JavaScript test runner.
- SASS or plain CSS with [autoprefixer](https://github.com/postcss/autoprefixer)
- [uuid](https://github.com/defunctzombie/node-uuid) Generate RFC-compliant UUIDs in JavaScript.
- [react-native-uuid](https://github.com/eugenehp/react-native-uuid) node-uuid for react-native.
- [gulp](http://gulpjs.com/) Aren't NPM scripts better? [No](https://twitter.com/jaffathecake/status/700320306053935104).
- [gulp-real-favicon](https://www.npmjs.com/package/gulp-real-favicon) Generate a multiplatform favicon with [RealFaviconGenerator](https://realfavicongenerator.net)
- [react-native-fbsdk](https://github.com/facebook/react-native-fbsdk) For Facebook Login in React Native. Follow the readme install notes.
- And much more. Explore the repository.

## Prerequisites

- [node.js](http://nodejs.org) Node 6 with NPM 3 is required.
- [gulp](http://gulpjs.com/) `npm install -g gulp`
- [git](https://git-scm.com/downloads) git cmd tool is required


#### Optional

- [Facebook SDK for iOS](https://developers.facebook.com/docs/ios/) In order to make Facebook login work on iOS
- [Facebook SDK for Android](https://developers.facebook.com/docs/android/) In order to make Facebook login work on Android
- [react-native-cli](http://facebook.github.io/react-native/docs/getting-started.html) `npm install -g react-native-cli`

If you are using different node versions on your machine, use [nvm](https://github.com/creationix/nvm) to manage them.

## Start Development

- run `gulp`
- point your browser to [localhost:3000](http://localhost:3000)

React Native: [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html)

## Dev Tasks

- `gulp` run web app in development mode
- `gulp ios` run iOS app in development mode
- `gulp android` run Android app in development mode
- `gulp -p` run web app in production mode
- `gulp ava` run ava unit tests
- `gulp ava-watch` continuous test running for TDD
- `gulp eslint` eslint
- `gulp eslint --fix` fix fixable eslint issues
- `gulp messages-extract` extract messages for translation
- `gulp messages-check` check missing and unused translations
- `gulp messages-clear` remove unused translations
- `gulp favicon` create universal favicon

## Production Tasks

- `gulp build -p` build app for production
- `npm test` run all checks and tests
- `node src/server` start app, remember to set NODE_ENV and SERVER_URL
- `gulp to-html` render app to HTML for static hosting like [Firebase](https://www.firebase.com/features.html#features-hosting)

## Customize App

- set name in `package.json`
- set locales, apiUrl, etc. in `src/server/config.js`
- remove unused locale-data from `src/browser/index.js`
- set routes in `src/browser/createRoutes.js` and `src/native/routes.js`
- set title, links, etc. in `src/browser/app` and `src/native/app` dirs
- change `src/common/app/favicons/original/favicon.png`, then `gulp favicon`
- delete unused app features, todos for example: src/{platform}/todos
- remove unused reducers from `src/common/configureReducer.js`
- modify your FB app_id e.g. for [iOS](https://developers.facebook.com/docs/ios/getting-started/#configure-xcode-project)

## Flow

- install [nuclide.io](https://nuclide.io/)
- go to Nuclide settings, enable "Use the Flow binary included in each project"

## Tips and Tricks

- Open developer console to check current app state.
- With functional programming ([SOLID: the next step is Functional](http://blog.ploeh.dk/2014/03/10/solid-the-next-step-is-functional)), we don't need DI containers. We can use plain old [Pure DI](http://blog.ploeh.dk/2014/06/10/pure-di/). Check `injectMiddleware` in `configureMiddleware`.
- Learn immutable.js, for example [Seq](https://github.com/facebook/immutable-js#lazy-seq). Handy even for native arrays and objects. For example, get object values: `Seq(RoomType).toSet().toJS()`
- Recommended editor is [Atom](https://atom.io). Check [settings](https://github.com/este/este/wiki/Recommended-Atom.io-Settings).

## FAQ

#### Why do I get EACCES error during `npm install`?
 This indicates that you do not have permission to write to the directories that npm uses to store packages and commands. One possible solution is to change the permission to npm's default directory.
 1. Find the path to npm's directory:  `npm config get prefix`  For many systems, this will be `/usr/local`
 2. Change the owner of npm's directory's to the effective name of the current user
 ```
 sudo chown -R `whoami` <directory>
 ```

#### Why does the CSS flicker when starting the app/refreshing it?
In dev mode, webpack loads all the styles inline, which makes them hot reloadable. This behaviour disappears in production mode (`gulp -p`).

#### How is React Native used in this project?
In the same way as any other React Native project is created via `react-native init AwesomeProject`. But thanks to the universal application design we can easily share modules across platforms.

## Training
- [learn-reactjs.com](http://www.learn-reactjs.com)
