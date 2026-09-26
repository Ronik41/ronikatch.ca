import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { journey, adjacentExperience } from '../journey.mjs';

test('the guided route visits every role once, including WHOOP and early experience', () => {
  const visited = [];
  let stop = journey[0];
  while (stop && visited.length <= journey.length) {
    visited.push(stop.id);
    stop = adjacentExperience(stop.id, 1);
  }
  assert.deepEqual(visited, ['cybercab', 'cybertruck', 'whoop', 'ford', 'electrium', 'exceed']);
  assert.equal(stop, null, 'the journey ends instead of looping back to a car');
  assert.equal(adjacentExperience('cybercab', -1), null);
  assert.equal(adjacentExperience('whoop', -1).id, 'cybertruck');
});

test('the built site includes every experience photo, portrait, and résumé', () => {
  execFileSync(process.execPath, [new URL('./build-static.mjs', import.meta.url).pathname]);
  const files = journey.flatMap(c => [c.image, ...(c.photos || []).map(([src]) => src)]);
  files.push('images/about-me.jpg', 'assets/resume/Roni_Katcharovski_Resume_Software_2027.pdf', 'journey.css', 'journey.mjs', 'whoop-display.mjs');
  for (const file of files) {
    assert.ok(statSync(new URL(`../dist/${file}`, import.meta.url)).size > 0, `${file} must ship in the static output`);
  }
});
