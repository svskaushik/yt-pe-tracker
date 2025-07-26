#!/usr/bin/env node
/**
 * README Table Generator for YouTube PE Tracker
 * Generates markdown table from channels.csv and injects it into README.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_FILE = path.join(DATA_DIR, 'channels.csv');
const README_FILE = path.join(__dirname, '..', 'README.md');

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
 * Format number with thousands separators
 */
function formatNumber(num) {
  if (!num || isNaN(num)) return '-';
  return parseInt(num).toLocaleString();
}

/**
 * Format deal value
 */
function formatDealValue(value, currency = 'USD') {
  if (!value || isNaN(value)) return '-';
  
  const num = parseFloat(value);
  const currencySymbol = currency === 'USD' ? '$' : currency;
  
  if (num >= 1000000000) {
    return `${currencySymbol}${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${currencySymbol}${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${currencySymbol}${(num / 1000).toFixed(1)}K`;
  } else {
    return `${currencySymbol}${num.toLocaleString()}`;
  }
}

/**
 * Truncate text to specified length
 */
function truncate(text, maxLength = 30) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Create status badge
 */
function createStatusBadge(status) {
  const badges = {
    confirmed: '✅ Confirmed',
    rumored: '🔍 Rumored',
    pending: '⏳ Pending',
    withdrawn: '❌ Withdrawn',
    denied: '🚫 Denied'
  };
  return badges[status] || status;
}

/**
 * Generate markdown table from CSV data
 */
function generateMarkdownTable() {
  console.log('📊 Generating README table...');
  
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(CSV_FILE, 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    if (lines.length <= 1) {
      console.warn('⚠️  No data rows found in CSV file');
      return '| Channel | PE Firm | Date | Status |\n|---------|---------|------|--------|\n| No data available | - | - | - |';
    }
    
    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    // Find column indices
    const indices = {
      channel_name: headers.indexOf('channel_name'),
      channel_handle: headers.indexOf('channel_handle'),
      subscriber_count: headers.indexOf('subscriber_count'),
      pe_firm: headers.indexOf('pe_firm'),
      acquisition_date: headers.indexOf('acquisition_date'),
      acquisition_type: headers.indexOf('acquisition_type'),
      deal_value: headers.indexOf('deal_value'),
      deal_value_currency: headers.indexOf('deal_value_currency'),
      status: headers.indexOf('status'),
      source_url: headers.indexOf('source_url')
    };
    
    // Create table header
    let table = '| Channel | Subscribers | PE Firm | Type | Deal Value | Date | Status | Source |\n';
    table += '|---------|-------------|---------|------|------------|------|--------|--------|\n';
    
    // Sort data by acquisition date (newest first)
    const dataRows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        dataRows.push(values);
      }
    }
    
    dataRows.sort((a, b) => {
      const dateA = new Date(a[indices.acquisition_date] || '1900-01-01');
      const dateB = new Date(b[indices.acquisition_date] || '1900-01-01');
      return dateB - dateA; // Newest first
    });
    
    // Generate table rows
    for (const values of dataRows) {
      const channelName = values[indices.channel_name] || 'Unknown';
      const channelHandle = values[indices.channel_handle] || '';
      const subscriberCount = values[indices.subscriber_count];
      const peFirm = values[indices.pe_firm] || 'Unknown';
      const acquisitionType = values[indices.acquisition_type] || 'unknown';
      const dealValue = values[indices.deal_value];
      const dealCurrency = values[indices.deal_value_currency] || 'USD';
      const acquisitionDate = values[indices.acquisition_date] || 'Unknown';
      const status = values[indices.status] || 'unknown';
      const sourceUrl = values[indices.source_url] || '';
      
      // Format channel name with handle
      let channelDisplay = channelName;
      if (channelHandle) {
        channelDisplay = `**${channelName}**<br/><small>${channelHandle}</small>`;
      } else {
        channelDisplay = `**${channelName}**`;
      }
      
      // Format subscriber count
      const subscribersDisplay = formatNumber(subscriberCount);
      
      // Format PE firm
      const peFirmDisplay = truncate(peFirm, 20);
      
      // Format acquisition type
      const typeDisplay = acquisitionType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Format deal value
      const dealDisplay = formatDealValue(dealValue, dealCurrency);
      
      // Format date
      const dateDisplay = acquisitionDate === 'Unknown' ? 'Unknown' : new Date(acquisitionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Format status
      const statusDisplay = createStatusBadge(status);
      
      // Format source
      const sourceDisplay = sourceUrl ? `[📰](${sourceUrl} "View Source")` : '-';
      
      // Add table row
      table += `| ${channelDisplay} | ${subscribersDisplay} | ${peFirmDisplay} | ${typeDisplay} | ${dealDisplay} | ${dateDisplay} | ${statusDisplay} | ${sourceDisplay} |\n`;
    }
    
    // Add footer
    table += '\n';
    table += `<small><i>Last updated: ${new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })} UTC</i></small>\n`;
    table += `<small><i>Total channels tracked: ${dataRows.length}</i></small>\n`;
    
    console.log(`✅ Generated table with ${dataRows.length} channels`);
    return table;
    
  } catch (error) {
    console.error('❌ Error generating table:', error.message);
    return '| Channel | PE Firm | Date | Status |\n|---------|---------|------|--------|\n| Error loading data | - | - | - |';
  }
}

/**
 * Update README.md with generated table
 */
function updateReadme() {
  console.log('📝 Updating README.md...');
  
  try {
    // Read current README
    const readmeContent = fs.readFileSync(README_FILE, 'utf-8');
    
    // Generate new table
    const newTable = generateMarkdownTable();
    
    // Find the data section markers
    const startMarker = '<!--data-start-->';
    const endMarker = '<!--data-end-->';
    
    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
      console.error('❌ Could not find data section markers in README.md');
      console.error('   Make sure README.md contains <!--data-start--> and <!--data-end--> markers');
      return false;
    }
    
    // Replace content between markers
    const before = readmeContent.substring(0, startIndex + startMarker.length);
    const after = readmeContent.substring(endIndex);
    const newContent = before + '\n\n' + newTable + '\n' + after;
    
    // Write updated README
    fs.writeFileSync(README_FILE, newContent, 'utf-8');
    console.log('✅ README.md updated successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error updating README:', error.message);
    return false;
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const success = updateReadme();
  process.exit(success ? 0 : 1);
}

export { generateMarkdownTable, updateReadme };
