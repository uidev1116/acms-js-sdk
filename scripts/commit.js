'use strict';

import { systemCmd } from './lib/system.js';

import co from 'co';

// package.json
import pkg from '../package.json' assert { type: 'json' };

co(function* () {
  try {
    yield systemCmd('git add -A');
    yield systemCmd(`git commit -m "v${pkg.version}"`);
    yield systemCmd(`git tag v${pkg.version}`);
    yield systemCmd('git push');
    yield systemCmd('git push --tags');
  } catch (err) {
    console.log(err);
  }
});
