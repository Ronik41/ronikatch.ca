import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

test('the production build contains all personal photos referenced by the site', () => {
  const sources = ['driveway.js', 'experience.mjs'].map(file =>
    readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  ).join('\n');
  const photos = new Set([...sources.matchAll(/['"](images\/[^'"]+)['"]/g)].map(match => match[1]));
  assert.equal(photos.size, 6, 'all six personal photos remain represented');
  execFileSync(process.execPath, [new URL('./build-static.mjs', import.meta.url).pathname]);
  for (const photo of photos) {
    assert.ok(statSync(new URL(`../dist/${photo}`, import.meta.url)).size > 0, `${photo} must be deployed`);
  }
});
