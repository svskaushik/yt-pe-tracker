
/* global chrome */
import React, { useEffect, useState } from 'react';
import '../../assets/tailwind.css';

interface ChannelData {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_handle: string;
  pe_firm: string;
  acquisition_date: string;
  acquisition_type: string;
  deal_value: number | null;
  deal_value_currency: string;
  status: string;
  source_url: string;
  notes: string;
  tags: string[];
}

function App() {
  const [currentTabUrl, setCurrentTabUrl] = useState<string>('');
  const [currentChannel, setCurrentChannel] = useState<ChannelData | null>(null);
  const [allChannels, setAllChannels] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper: Extract channel ID from YouTube URL
  function extractChannelIdFromUrl(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const match = pathname.match(/^\/channel\/([a-zA-Z0-9_-]{24})$/);
      if (match) return match[1];
      return null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Get current tab URL
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab?.url || '';
        setCurrentTabUrl(url);

        // Get channel data from background
        const response = await chrome.runtime.sendMessage({ type: 'GET_CHANNEL_DATA' });
        if (!response.success) throw new Error(response.error || 'Failed to get channel data');
        const db = response.data;
        setAllChannels(db.channels || []);

        // Try to extract channel ID from current tab
        const channelId = extractChannelIdFromUrl(url);
        if (channelId) {
          const found = db.channels.find((c: ChannelData) => c.channel_id === channelId);
          setCurrentChannel(found || null);
        } else {
          setCurrentChannel(null);
        }
      } catch (e: any) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-w-[340px] max-w-[400px] bg-white p-4 font-sans">
      <h1 className="text-xl font-bold text-pe-700 mb-2">YouTube PE Tracker</h1>
      
      {/* Badge Status */}
      <div className="mb-3">
        <div className="flex items-center text-xs">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">PE badges active on this page</span>
        </div>
      </div>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <>
          {/* Current Channel Info */}
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Current Tab:</div>
            <div className="truncate text-xs text-blue-700 mb-2">{currentTabUrl}</div>
            {currentChannel ? (
              <div className="border border-pe-300 rounded-lg p-3 bg-pe-50 mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-pe-700">{currentChannel.channel_name}</span>
                  <span className="text-xs px-2 py-1 rounded bg-pe-100 text-pe-800 border border-pe-200">
                    PE-Owned
                  </span>
                </div>
                <div className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">Firm:</span> {currentChannel.pe_firm}
                </div>
                <div className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">Acquisition:</span> {currentChannel.acquisition_type.replace('_', ' ')}
                </div>
                <div className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">Date:</span> {currentChannel.acquisition_date}
                </div>
                <a href={currentChannel.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-pe-600 underline">
                  View Source
                </a>
              </div>
            ) : (
              <div className="text-xs text-gray-500">No PE-acquired channel detected on this tab.</div>
            )}
          </div>

          {/* All Channels List */}
          <div>
            <div className="font-semibold text-pe-700 mb-1">All PE-Acquired Channels</div>
            <div className="max-h-48 overflow-y-auto border rounded-lg bg-gray-50">
              {allChannels.length === 0 ? (
                <div className="text-xs text-gray-500 p-2">No channels in database.</div>
              ) : (
                <ul className="divide-y divide-pe-100">
                  {allChannels.map((ch) => (
                    <li key={ch.channel_id} className="p-2 flex flex-col hover:bg-pe-50 transition">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-pe-800 text-sm">{ch.channel_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-pe-100 text-pe-800 border border-pe-200">
                          {ch.pe_firm}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 truncate">{ch.channel_handle} &bull; {ch.acquisition_type.replace('_', ' ')}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
      <div className="mt-4 text-xs text-gray-400 text-center">
        <a href="https://github.com/svskaushik/yt-pe-tracker" target="_blank" rel="noopener noreferrer" className="underline">GitHub</a>
        {' '}|{' '}
        <a href="https://github.com/svskaushik/yt-pe-tracker/issues" target="_blank" rel="noopener noreferrer" className="underline">Report Issue</a>
      </div>
    </div>
  );
}

export default App;
