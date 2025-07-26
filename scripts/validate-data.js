#!/usr/bin/env node
/**
 * Data Validator for YouTube PE Tracker
 * Validates channels.csv against the JSON schema
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_FILE = path.join(DATA_DIR, 'channels.csv');
const SCHEMA_FILE = path.join(DATA_DIR, 'channels.schema.json');

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
 * Validate a single field value
 */
function validateField(fieldName, value, rowIndex) {
  const errors = [];
  
  // Handle empty/null values
  if (value === '' || value === 'null' || value === 'NULL') {
    value = null;
  }
  
  switch (fieldName) {
    case 'id':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'id'`);
      } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        errors.push(`Row ${rowIndex}: Invalid UUID format for 'id': ${value}`);
      }
      break;
      
    case 'channel_id':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'channel_id'`);
      } else if (!/^UC[a-zA-Z0-9_-]{22}$/.test(value)) {
        errors.push(`Row ${rowIndex}: Invalid YouTube channel ID format: ${value}`);
      }
      break;
      
    case 'channel_name':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'channel_name'`);
      } else if (value.length > 100) {
        errors.push(`Row ${rowIndex}: Channel name too long (max 100 chars): ${value}`);
      }
      break;
      
    case 'channel_handle':
      if (value && !/^@[a-zA-Z0-9._-]+$/.test(value)) {
        errors.push(`Row ${rowIndex}: Invalid channel handle format: ${value}`);
      }
      break;
      
    case 'subscriber_count':
      if (value && (isNaN(value) || parseInt(value) < 0)) {
        errors.push(`Row ${rowIndex}: Invalid subscriber count: ${value}`);
      }
      break;
      
    case 'pe_firm':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'pe_firm'`);
      } else if (value.length > 100) {
        errors.push(`Row ${rowIndex}: PE firm name too long (max 100 chars): ${value}`);
      }
      break;
      
    case 'acquisition_date':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'acquisition_date'`);
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        errors.push(`Row ${rowIndex}: Invalid date format (expected YYYY-MM-DD): ${value}`);
      } else {
        // Check if date is valid
        const date = new Date(value);
        if (isNaN(date.getTime()) || date.toISOString().split('T')[0] !== value) {
          errors.push(`Row ${rowIndex}: Invalid date: ${value}`);
        }
      }
      break;
      
    case 'acquisition_type':
      const validTypes = ['full_acquisition', 'majority_stake', 'minority_stake', 'partnership', 'investment', 'unknown'];
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'acquisition_type'`);
      } else if (!validTypes.includes(value)) {
        errors.push(`Row ${rowIndex}: Invalid acquisition type '${value}'. Valid options: ${validTypes.join(', ')}`);
      }
      break;
      
    case 'deal_value':
      if (value && (isNaN(value) || parseFloat(value) < 0)) {
        errors.push(`Row ${rowIndex}: Invalid deal value: ${value}`);
      }
      break;
      
    case 'deal_value_currency':
      const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'other'];
      if (value && !validCurrencies.includes(value)) {
        errors.push(`Row ${rowIndex}: Invalid currency '${value}'. Valid options: ${validCurrencies.join(', ')}`);
      }
      break;
      
    case 'status':
      const validStatuses = ['confirmed', 'rumored', 'pending', 'withdrawn', 'denied'];
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'status'`);
      } else if (!validStatuses.includes(value)) {
        errors.push(`Row ${rowIndex}: Invalid status '${value}'. Valid options: ${validStatuses.join(', ')}`);
      }
      break;
      
    case 'source_url':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'source_url'`);
      } else {
        try {
          new URL(value);
        } catch {
          errors.push(`Row ${rowIndex}: Invalid URL format for source_url: ${value}`);
        }
      }
      break;
      
    case 'additional_sources':
      if (value) {
        const urls = value.split(',').map(url => url.trim());
        for (const url of urls) {
          if (url) {
            try {
              new URL(url);
            } catch {
              errors.push(`Row ${rowIndex}: Invalid URL in additional_sources: ${url}`);
            }
          }
        }
      }
      break;
      
    case 'notes':
      if (value && value.length > 500) {
        errors.push(`Row ${rowIndex}: Notes too long (max 500 chars): ${value.substring(0, 50)}...`);
      }
      break;
      
    case 'last_updated':
      if (!value) {
        errors.push(`Row ${rowIndex}: Missing required field 'last_updated'`);
      } else if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
        errors.push(`Row ${rowIndex}: Invalid datetime format (expected ISO 8601): ${value}`);
      } else {
        // Check if datetime is valid
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push(`Row ${rowIndex}: Invalid datetime: ${value}`);
        }
      }
      break;
      
    case 'tags':
      if (value) {
        const validTags = ['gaming', 'entertainment', 'education', 'tech', 'lifestyle', 'news', 'sports', 'music', 'comedy', 'business', 'family', 'beauty', 'food', 'travel', 'other'];
        const tags = value.split(',').map(tag => tag.trim());
        for (const tag of tags) {
          if (tag && !validTags.includes(tag)) {
            errors.push(`Row ${rowIndex}: Invalid tag '${tag}'. Valid options: ${validTags.join(', ')}`);
          }
        }
      }
      break;
  }
  
  return errors;
}

/**
 * Validate the CSV file
 */
function validateCSV() {
  console.log('🔍 Validating CSV data...');
  
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length === 0) {
      console.error('❌ CSV file is empty');
      return false;
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    console.log(`📋 Found ${headers.length} columns: ${headers.join(', ')}`);
    
    // Required columns from schema
    const requiredFields = ['id', 'channel_id', 'channel_name', 'pe_firm', 'acquisition_date', 'acquisition_type', 'status', 'source_url', 'last_updated'];
    
    // Check for missing required columns
    const missingColumns = requiredFields.filter(field => !headers.includes(field));
    if (missingColumns.length > 0) {
      console.error(`❌ Missing required columns: ${missingColumns.join(', ')}`);
      return false;
    }
    
    let totalErrors = 0;
    const duplicateIds = new Set();
    const duplicateChannelIds = new Set();
    const seenIds = new Set();
    const seenChannelIds = new Set();
    
    // Validate each data row
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const rowIndex = i + 1;
      
      if (values.length !== headers.length) {
        console.error(`❌ Row ${rowIndex}: Expected ${headers.length} columns but found ${values.length}`);
        totalErrors++;
        continue;
      }
      
      // Validate each field
      for (let j = 0; j < headers.length; j++) {
        const fieldName = headers[j];
        const value = values[j];
        const fieldErrors = validateField(fieldName, value, rowIndex);
        
        if (fieldErrors.length > 0) {
          fieldErrors.forEach(error => console.error(`❌ ${error}`));
          totalErrors += fieldErrors.length;
        }
      }
      
      // Check for duplicate IDs
      const id = values[headers.indexOf('id')];
      const channelId = values[headers.indexOf('channel_id')];
      
      if (id && seenIds.has(id)) {
        duplicateIds.add(id);
        console.error(`❌ Row ${rowIndex}: Duplicate ID found: ${id}`);
        totalErrors++;
      } else if (id) {
        seenIds.add(id);
      }
      
      if (channelId && seenChannelIds.has(channelId)) {
        duplicateChannelIds.add(channelId);
        console.error(`❌ Row ${rowIndex}: Duplicate channel_id found: ${channelId}`);
        totalErrors++;
      } else if (channelId) {
        seenChannelIds.add(channelId);
      }
    }
    
    // Summary
    const totalRows = lines.length - 1; // Exclude header
    console.log(`\n📊 Validation Summary:`);
    console.log(`   Total rows: ${totalRows}`);
    console.log(`   Errors found: ${totalErrors}`);
    console.log(`   Duplicate IDs: ${duplicateIds.size}`);
    console.log(`   Duplicate Channel IDs: ${duplicateChannelIds.size}`);
    
    if (totalErrors === 0) {
      console.log('✅ CSV validation passed!');
      return true;
    } else {
      console.log('❌ CSV validation failed!');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error reading CSV file:', error.message);
    return false;
  }
}

// Run validation if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isValid = validateCSV();
  process.exit(isValid ? 0 : 1);
}

export { validateCSV };
