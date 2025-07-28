import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

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

interface PEBadgeProps {
  channelData: ChannelData;
  onClose?: () => void;
}

const PEBadge: React.FC<PEBadgeProps> = ({ channelData, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number | null, currency: string) => {
    if (!amount) return 'Undisclosed';
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency} ${amount.toLocaleString()}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rumored':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAcquisitionTypeLabel = (type: string) => {
    switch (type) {
      case 'minority_stake':
        return 'Minority Stake';
      case 'majority_stake':
        return 'Majority Stake';
      case 'full_acquisition':
        return 'Full Acquisition';
      case 'partnership':
        return 'Partnership';
      default:
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div
      className={`yt-pe-badge-animate transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
      }`}
      style={{
        fontFamily: '"YouTube Sans", "Roboto", sans-serif',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
    >
      {/* Main Badge */}
      <div className="bg-white border-2 border-pe-500 rounded-lg shadow-pe-badge overflow-hidden">
        {/* Header */}
        <div className="bg-pe-500 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="font-semibold text-sm">PE-Owned Channel</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:text-pe-100 transition-colors duration-200 text-xs"
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
            >
              {isExpanded ? '−' : '+'}
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-pe-100 transition-colors duration-200 text-xs font-bold"
              aria-label="Close badge"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Firm Info */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-gray-900 text-base">
                {channelData.pe_firm}
              </div>
              <div className="text-gray-600 text-sm">
                {getAcquisitionTypeLabel(channelData.acquisition_type)}
              </div>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(channelData.status)}`}>
              {channelData.status.charAt(0).toUpperCase() + channelData.status.slice(1)}
            </div>
          </div>

          {/* Expanded Details */}
          {isExpanded && (
            <div className="border-t pt-3 mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Acquisition Date:</span>
                <span className="font-medium">{formatDate(channelData.acquisition_date)}</span>
              </div>
              
              {channelData.deal_value && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Deal Value:</span>
                  <span className="font-medium">
                    {formatCurrency(channelData.deal_value, channelData.deal_value_currency)}
                  </span>
                </div>
              )}

              {channelData.notes && (
                <div>
                  <div className="text-gray-600 mb-1">Notes:</div>
                  <div className="text-gray-800 text-xs bg-gray-50 p-2 rounded">
                    {channelData.notes}
                  </div>
                </div>
              )}

              {channelData.tags && channelData.tags.length > 0 && (
                <div>
                  <div className="text-gray-600 mb-1">Tags:</div>
                  <div className="flex flex-wrap gap-1">
                    {channelData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <a
                  href={channelData.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pe-600 hover:text-pe-700 text-xs underline"
                >
                  View Source →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

let badgeRoot: ReturnType<typeof createRoot> | null = null;
let badgeContainer: HTMLElement | null = null;

export function createPEBadge(channelData: ChannelData): void {
  try {
    // Remove existing badge first
    removePEBadge();

    // Find insertion point - try different YouTube layout selectors
    const insertionSelectors = [
      '#channel-header-content', // New YouTube layout
      '#channel-header',
      'ytd-channel-header-renderer',
      '.channel-header-content',
      '#header'
    ];

    let insertionPoint: Element | null = null;
    for (const selector of insertionSelectors) {
      insertionPoint = document.querySelector(selector);
      if (insertionPoint) {
        console.log('Found insertion point:', selector);
        break;
      }
    }

    if (!insertionPoint) {
      console.warn('Could not find suitable insertion point for PE badge');
      return;
    }

    // Create container
    badgeContainer = document.createElement('div');
    badgeContainer.id = 'yt-pe-tracker-badge';
    badgeContainer.style.cssText = `
      position: relative;
      z-index: 9999;
      margin: 12px 0;
      max-width: 400px;
    `;

    // Insert at the top of the header
    insertionPoint.insertBefore(badgeContainer, insertionPoint.firstChild);

    // Create React root and render
    badgeRoot = createRoot(badgeContainer);
    badgeRoot.render(
      <PEBadge 
        channelData={channelData} 
        onClose={removePEBadge}
      />
    );

    console.log('PE badge created successfully');
  } catch (error) {
    console.error('Error creating PE badge:', error);
  }
}

export function removePEBadge(): void {
  try {
    if (badgeRoot) {
      badgeRoot.unmount();
      badgeRoot = null;
    }

    if (badgeContainer) {
      badgeContainer.remove();
      badgeContainer = null;
    }

    console.log('PE badge removed');
  } catch (error) {
    console.error('Error removing PE badge:', error);
  }
}

export default PEBadge;
