const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'source');
const parts = fs.readdirSync(sourceDir).filter((name) => /^app\.part\d+$/.test(name)).sort();
if (!parts.length) throw new Error('Compressed app source parts were not found.');
const encoded = parts.map((name) => fs.readFileSync(path.join(sourceDir, name), 'utf8')).join('').replace(/\s+/g, '');
const html = zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');

for (const [marker, limit] of [
  ['async function refreshData(){', 1800],
  ['function renderUsers(){', 5200],
  ['function openUserForm(', 2400],
  ['function editUserProfile(', 2400],
  ['function ownerName(', 500]
]) {
  const index = html.indexOf(marker);
  if (index >= 0) console.log('\n--- FUNCTION: ' + marker + ' @ ' + index + ' ---\n' + html.slice(index, index + limit));
  else console.log('\n--- FUNCTION NOT FOUND: ' + marker + ' ---');
}

const refs = [...html.matchAll(/state\.profiles/g)];
console.log('\nSTATE_PROFILES_REFERENCE_COUNT=' + refs.length);
for (const match of refs) {
  const index = match.index;
  console.log('\n--- STATE PROFILES USE @ ' + index + ' ---\n' + html.slice(Math.max(0,index-180), Math.min(html.length,index+300)));
}
console.log('\nAUDIT_SOURCE_LENGTH=' + html.length);
