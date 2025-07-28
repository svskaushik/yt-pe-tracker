// scripts/json-to-csv.js
// Usage: node scripts/json-to-csv.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../data/channels.json');
const csvPath = path.join(__dirname, '../data/channels.csv');

const FIELDS = [
  'id',
  'channel_id',
  'channel_name',
  'channel_handle',
  'subscriber_count',
  'pe_firm',
  'acquisition_date',
  'acquisition_type',
  'deal_value',
  'deal_value_currency',
  'status',
  'source_url',
  'additional_sources',
  'notes',
  'last_updated',
  'verified_by',
  'tags',
];

function escapeCsv(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function toCsvRow(obj) {
  return FIELDS.map(field => {
    if (field === 'tags') {
      // tags: array to comma-separated string
      return escapeCsv((obj.tags || []).join(','));
    }
    if (field === 'additional_sources') {
      // additional_sources: array to pipe-separated string
      if (Array.isArray(obj.additional_sources)) {
        return escapeCsv(obj.additional_sources.join('|'));
      }
      return escapeCsv(obj.additional_sources || '');
    }
    return escapeCsv(obj[field]);
  }).join(',');
}

function main() {
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const rows = [FIELDS.join(',')];
  for (const channel of json.channels) {
    rows.push(toCsvRow(channel));
  }
  fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');
  console.warn(`CSV generated at ${csvPath}`);
}

main();
