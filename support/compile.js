/*!
 * chai-spies :: browser build script
 * Copyright (c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Script dependancies
 */

var folio = require('folio');

/*!
 * Folio Definition
 */

folio('chai-spies')
  .root(__dirname, '..')
  .use('reader')
    .file('./lib/spy.js')
    .pop()
  .use('indent')
    .line('  ')
    .pop()
  .use('wrapper')
    .template('chai-exports')
    .pop()
  .use('save')
    .file('./chai-spies.js')
    .pop()
  .compile();
