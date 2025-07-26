#!/usr/bin/env node
/**
 * CSV to JSON Converter for YouTube PE Tracker
 * Converts channels.csv to channels.min.json for consumption by web app and extension
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_FILE = path.join(DATA_DIR, 'channels.csv');
const JSON_FILE = path.join(DATA_DIR, 'channels.json');
const MINIFIED_JSON_FILE = path.join(DATA_DIR, 'channels.min.json');

/**
 * Parse CSV line while handling quoted fields
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Convert CSV to JSON with proper data types
 */
function convertCSVToJSON() {
  console.log('🔄 Converting CSV to JSON...');
  
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty');
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 Found ${headers.length} columns: ${headers.join(', ')}`);
    
    // Parse data rows
    const channels = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`⚠️  Row ${i + 1} has ${values.length} values but expected ${headers.length}. Skipping.`);
        continue;
      }
      
      const channel = {};
      
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        let value = values[j];
        
        // Handle empty values
        if (value === '' || value === 'null' || value === 'NULL') {
          value = null;
        } else {
          // Type conversions
          switch (header) {
            case 'subscriber_count':
            case 'deal_value':
              value = value ? parseInt(value, 10) : null;
              break;
            case 'acquisition_date':
              // Validate date format YYYY-MM-DD
              if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                console.warn(`⚠️  Invalid date format in row ${i + 1}: ${value}`);
              }
              break;
            case 'last_updated':
              // Validate ISO datetime
              if (value && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
                console.warn(`⚠️  Invalid datetime format in row ${i + 1}: ${value}`);
              }
              break;
            case 'additional_sources':
            case 'tags':
              // Parse comma-separated lists
              if (value) {
                value = value.split(',').map(item => item.trim()).filter(item => item);
              } else {
                value = [];
              }
              break;
            case 'channel_id':
              // Validate YouTube channel ID format
              if (value && !/^UC[a-zA-Z0-9_-]{22}$/.test(value)) {
                console.warn(`⚠️  Invalid YouTube channel ID format in row ${i + 1}: ${value}`);
              }
              break;
            case 'source_url':
              // Validate URL format
              if (value && !value.startsWith('http')) {
                console.warn(`⚠️  Invalid URL format in row ${i + 1}: ${value}`);
              }
              break;
          }
        }
        
        channel[header] = value;
      }
      
      channels.push(channel);
    }
    
    console.log(`✅ Parsed ${channels.length} channel records`);
    
    // Create JSON structure
    const jsonData = {
      meta: {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        total_channels: channels.length,
        description: 'YouTube Channel Private Equity Ownership Database'
      },
      channels: channels
    };
    
    // Write formatted JSON
    fs.writeFileSync(JSON_FILE, JSON.stringify(jsonData, null, 2), 'utf-8');
    console.log(`📝 Written formatted JSON to ${JSON_FILE}`);
    
    // Write minified JSON
    fs.writeFileSync(MINIFIED_JSON_FILE, JSON.stringify(jsonData), 'utf-8');
    console.log(`📦 Written minified JSON to ${MINIFIED_JSON_FILE}`);
    
    // Display statistics
    const stats = {
      total_channels: channels.length,
      confirmed: channels.filter(c => c.status === 'confirmed').length,
      rumored: channels.filter(c => c.status === 'rumored').length,
      pending: channels.filter(c => c.status === 'pending').length,
      unique_pe_firms: [...new Set(channels.map(c => c.pe_firm))].length
    };
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total Channels: ${stats.total_channels}`);
    console.log(`   Confirmed: ${stats.confirmed}`);
    console.log(`   Rumored: ${stats.rumored}`);
    console.log(`   Pending: ${stats.pending}`);
    console.log(`   Unique PE Firms: ${stats.unique_pe_firms}`);
    
    return jsonData;
    
  } catch (error) {
    console.error('❌ Error converting CSV to JSON:', error.message);
    process.exit(1);
  }
}

// Run conversion if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  convertCSVToJSON();
}

export { convertCSVToJSON };
