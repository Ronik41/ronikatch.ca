import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobileStops } from '../scene-geometry.mjs';

test('mobile garage goes left from Cybercab to Cybertruck to Lincoln, and right in reverse', () => {
  assert.deepEqual(mobileStops, ['ford', 'cybertruck', 'cybercab']);
  const start = mobileStops.indexOf('cybercab');
  assert.equal(mobileStops[start - 1], 'cybertruck');
  assert.equal(mobileStops[start - 2], 'ford');
  assert.equal(mobileStops[start - 3], undefined);
  assert.equal(mobileStops[start + 1], undefined);
});
