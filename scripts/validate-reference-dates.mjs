import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { toBik_euro, toGreg_text } from '../js/dist/index.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const referencePath = join(root, 'test-data', 'reference-dates.json');
const references = JSON.parse(await readFile(referencePath, 'utf8'));

for (const reference of references) {
  assert.equal(toBik_euro(reference.ad), reference.bs, `${reference.ad} should convert to ${reference.bs}`);

  const [year, month, day] = reference.bs.split('-').map(Number);
  assert.equal(toGreg_text(year, month, day), reference.ad, `${reference.bs} should convert to ${reference.ad}`);
}

console.log(`Validated ${references.length} reference date pair(s).`);
