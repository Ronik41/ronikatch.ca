import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobileStops, sceneOrigins } from '../scene-geometry.mjs';

test('mobile arrows and swipes traverse the driveway from left to right', () => {
  assert.equal(new Set(mobileStops).size, 6);
  assert.equal(mobileStops[0], 'ford');
  assert.equal(mobileStops.at(-1), 'cybercab');
  for (let i = 1; i < mobileStops.length; i++) {
    const left = parseFloat(sceneOrigins[mobileStops[i - 1]]);
    const right = parseFloat(sceneOrigins[mobileStops[i]]);
    assert.ok(right > left, `Right arrow must move right from ${mobileStops[i - 1]} to ${mobileStops[i]}`);
  }
});
