import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mobileStops } from '../scene-geometry.mjs';

test('mobile navigation visits every experience chronologically in both directions', () => {
  const newestToOldest = ['cybercab', 'cybertruck', 'whoop', 'ford', 'electrium', 'exceed'];
  const start = mobileStops.indexOf('cybercab');
  assert.equal(mobileStops.length, newestToOldest.length);
  newestToOldest.forEach((id, steps) => {
    assert.equal(mobileStops[start - steps], id, `Left ${steps} times from Cybercab`);
    assert.equal(mobileStops[steps], newestToOldest.at(-1 - steps), `Right ${steps} times from Exceed`);
  });
  assert.equal(mobileStops[-1], undefined);
  assert.equal(mobileStops[start + 1], undefined);
});
