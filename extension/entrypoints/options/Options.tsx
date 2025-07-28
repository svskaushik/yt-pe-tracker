import React, { useState, useEffect } from 'react';

interface OptionsData {
  hideOwnedChannels: boolean;
  showDealValues: boolean;
  autoRefresh: boolean;
}

const Options: React.FC = () => {
  const [options, setOptions] = useState<OptionsData>({
    hideOwnedChannels: false,
    showDealValues: true,
    autoRefresh: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load options on component mount
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const result = await browser.storage.sync.get(['yt_pe_options']);
      if (result.yt_pe_options) {
        setOptions({ ...options, ...result.yt_pe_options });
      }
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const saveOptions = async (newOptions: OptionsData) => {
    setIsSaving(true);
    try {
      await browser.storage.sync.set({ yt_pe_options: newOptions });
      setOptions(newOptions);
      setLastSaved(new Date());
      console.log('Options saved successfully');
    } catch (error) {
      console.error('Failed to save options:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: keyof OptionsData) => {
    const newOptions = { ...options, [key]: !options[key] };
    saveOptions(newOptions);
  };

  const refreshData = async () => {
    try {
      const response = await browser.runtime.sendMessage({
        type: 'REFRESH_DATA'
      });
      
      if (response.success) {
        console.log('Data refreshed successfully');
        setLastSaved(new Date());
      } else {
        console.error('Failed to refresh data:', response.error);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-pe-500 text-white px-6 py-4">
          <h1 className="text-2xl font-bold">YT PE Tracker Options</h1>
          <p className="text-pe-100 mt-1">Configure your YouTube Private Equity tracker settings</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Display Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Display Settings</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Hide PE-Owned Channels</h3>
                <p className="text-sm text-gray-600 mt-1">
                  When enabled, channels owned by private equity firms will be hidden from view
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.hideOwnedChannels}
                  onChange={() => handleToggle('hideOwnedChannels')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pe-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pe-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Show Deal Values</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Display acquisition deal values when available
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.showDealValues}
                  onChange={() => handleToggle('showDealValues')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pe-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pe-500"></div>
              </label>
            </div>
          </div>

          {/* Data Options */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Data Settings</h2>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Auto-refresh Data</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically refresh channel data every 24 hours
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.autoRefresh}
                  onChange={() => handleToggle('autoRefresh')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pe-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pe-500"></div>
              </label>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Manual Data Refresh</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Manually update the channel database from GitHub
                  </p>
                  {lastSaved && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last updated: {lastSaved.toLocaleString()}
                    </p>
                  )}
                </div>
                <button
                  onClick={refreshData}
                  disabled={isSaving}
                  className="px-4 py-2 bg-pe-500 text-white rounded-lg hover:bg-pe-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSaving ? 'Refreshing...' : 'Refresh Now'}
                </button>
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">About YT PE Tracker</h3>
            <p className="text-sm text-blue-800 mb-2">
              This extension helps identify YouTube channels that have been acquired by private equity firms.
              Data is maintained by the community and updated regularly.
            </p>
            <div className="flex space-x-4 text-sm">
              <a
                href="https://github.com/svskaushik/yt-pe-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                GitHub Repository
              </a>
              <a
                href="https://github.com/svskaushik/yt-pe-tracker/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Report Issue
              </a>
            </div>
          </div>

          {/* Save Status */}
          {isSaving && (
            <div className="text-center text-sm text-gray-600">
              Saving options...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Options;
