// scripts/json-to-min.js
// Usage: node scripts/json-to-min.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/channels.json');
const minJsonPath = path.join(__dirname, '../data/channels.min.json');

function main() {
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Update the meta information
  json.meta.generated_at = new Date().toISOString();
  json.meta.total_channels = json.channels.length;
  
  // Write minified JSON (no formatting)
  fs.writeFileSync(minJsonPath, JSON.stringify(json), 'utf8');
  console.warn(`Minified JSON generated at ${minJsonPath} with ${json.channels.length} channels`);
}

main();
