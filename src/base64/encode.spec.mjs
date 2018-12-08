import assert from 'assert'

import encode from './encode.mjs'
import samples from './encode.fixture.json'

samples.forEach(sample => {
  assert.strictEqual(encode(sample), Buffer.from(sample).toString('base64'))
})
