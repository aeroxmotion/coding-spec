import assert from 'assert'

import decode from './decode.mjs'
import samples from './decode.fixture.json'

samples.forEach(sample => {
  assert.strictEqual(decode(Buffer.from(sample).toString('base64')), sample)
})
