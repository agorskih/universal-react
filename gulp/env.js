import args from './support/args';
import gulp from 'gulp';
import { execSync } from 'child_process';

gulp.task('env', () => {
  process.env.appName = require('../package.json').name;
  process.env.NODE_ENV = args.production ? 'production' : 'development';
  // The app is not a library, so it doesn't make sense to use semver.
  // Este uses appVersion for crash reporting to match bad builds easily.
  const gitIsAvailable = !process.env.SOURCE_VERSION; // Heroku detection.
  if (gitIsAvailable) {
    console.log('git is available');
    process.env.appVersion = execSync('git rev-parse HEAD').toString().trim();
  }
  else
    console.log('git is not available');
});
