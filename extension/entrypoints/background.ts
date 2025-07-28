export default defineBackground(() => {
  console.log('YT PE Tracker background script loaded');

  // URL to fetch channel data
  const CHANNELS_DATA_URL = 'https://raw.githubusercontent.com/svskaushik/yt-pe-tracker/refs/heads/main/data/channels.min.json';
  const STORAGE_KEY = 'yt_pe_channels_data';
  const LAST_FETCH_KEY = 'yt_pe_last_fetch';
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Fetch and store channel data
  async function fetchAndStoreChannelData() {
    try {
      console.log('Fetching channel data from GitHub...');
      
      // Add cache-busting parameter to avoid CDN caching issues
      const cacheBustingUrl = `${CHANNELS_DATA_URL}?t=${Date.now()}`;
      const response = await fetch(cacheBustingUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Fetched ${data.channels?.length || 0} channels`);
      
      // Store data and timestamp
      await browser.storage.local.set({
        [STORAGE_KEY]: data,
        [LAST_FETCH_KEY]: Date.now()
      });
      
      console.log('Channel data stored successfully');
      return data;
    } catch (error) {
      console.error('Failed to fetch channel data:', error);
      
      // Try to get cached data if fetch fails
      const result = await browser.storage.local.get([STORAGE_KEY]);
      return result[STORAGE_KEY] || { channels: [] };
    }
  }

  // Check if data needs to be refreshed
  async function shouldRefreshData(): Promise<boolean> {
    try {
      const result = await browser.storage.local.get([LAST_FETCH_KEY, STORAGE_KEY]);
      const lastFetch = result[LAST_FETCH_KEY];
      const hasData = result[STORAGE_KEY];
      
      // Refresh if no data or cache is older than 24 hours
      if (!hasData || !lastFetch || (Date.now() - lastFetch) > CACHE_DURATION) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking refresh status:', error);
      return true;
    }
  }

  // Initialize data on startup
  async function initializeData() {
    if (await shouldRefreshData()) {
      await fetchAndStoreChannelData();
    } else {
      console.log('Using cached channel data');
    }
  }

  // Handle extension startup
  browser.runtime.onStartup.addListener(() => {
    console.log('Extension started, checking data freshness...');
    initializeData();
  });

  // Handle extension installation
  browser.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed/updated:', details.reason);
    initializeData();
  });

  // Handle periodic data refresh (set alarm for daily refresh)
  browser.alarms?.create?.('refresh-channel-data', {
    delayInMinutes: 24 * 60, // 24 hours
    periodInMinutes: 24 * 60 // repeat every 24 hours
  });

  // Handle alarm for periodic refresh
  browser.alarms?.onAlarm?.addListener((alarm) => {
    if (alarm.name === 'refresh-channel-data') {
      console.log('Periodic refresh triggered');
      fetchAndStoreChannelData();
    }
  });

  // Message handler for content scripts
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_CHANNEL_DATA') {
      browser.storage.local.get([STORAGE_KEY])
        .then(result => {
          sendResponse({
            success: true,
            data: result[STORAGE_KEY] || { channels: [] }
          });
        })
        .catch(error => {
          console.error('Error getting channel data:', error);
          sendResponse({
            success: false,
            error: error.message
          });
        });
      return true; // Will respond asynchronously
    }
    
    if (message.type === 'REFRESH_DATA') {
      fetchAndStoreChannelData()
        .then(data => {
          sendResponse({
            success: true,
            data: data
          });
        })
        .catch(error => {
          console.error('Error refreshing data:', error);
          sendResponse({
            success: false,
            error: error.message
          });
        });
      return true; // Will respond asynchronously
    }
  });

  // Initialize data on background script load
  initializeData();
});
