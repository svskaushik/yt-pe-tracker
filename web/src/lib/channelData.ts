/* eslint-disable */
/// <reference types="node" />

// Simple server-side data fetching for now
export interface ChannelData {
  id: string;
  channel_id: string;
  channel_name: string;
  channel_handle: string | null;
  subscriber_count: number | null;
  pe_firm: string;
  acquisition_date: string;
  acquisition_type: 'full_acquisition' | 'majority_stake' | 'minority_stake' | 'partnership' | 'investment' | 'unknown';
  deal_value: number | null;
  deal_value_currency: string;
  status: 'confirmed' | 'rumored' | 'pending' | 'withdrawn' | 'denied';
  source_url: string;
  additional_sources: string[] | null;
  notes: string | null;
  last_updated: string;
  verified_by: string | null;
  tags: string[];
}

export interface ChannelsData {
  meta: {
    generated_at: string;
    version: string;
    total_channels: number;
    description: string;
  };
  channels: ChannelData[];
}



/**
 * Fetch channels data from GitHub raw URL (production-ready)
 */
// eslint-disable-next-line no-restricted-globals, no-console
export async function getChannelsServer(): Promise<ChannelData[]> {
  const url = 'https://raw.githubusercontent.com/svskaushik/yt-pe-tracker/refs/heads/main/data/channels.min.json';
  try {
    // Use globalThis.fetch for Node.js compatibility
    const res = await (globalThis.fetch as typeof fetch)(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch channels data: ${res.status} ${res.statusText}`);
    }
    const parsedData = (await res.json()) as ChannelsData;
    return parsedData.channels;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching channels data from GitHub:', error);
    return [];
  }
}

/**
 * Get unique PE firms (server-side)
 */
export async function getPEFirmsServer(): Promise<string[]> {
  const data = await getChannelsServer();
  const firms = Array.from(new Set(data.map((channel: ChannelData) => channel.pe_firm)));
  return (firms as string[]).sort();
}

/**
 * Format subscriber count for display
 */
export function formatSubscriberCount(count: number | null): string {
  if (!count) return 'Unknown';
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  
  return count.toString();
}

/**
 * Format deal value for display
 */
export function formatDealValue(value: number | null, currency: string = 'USD'): string {
  if (!value) return 'Undisclosed';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  if (value >= 1000000000) {
    return formatter.format(value / 1000000000) + 'B';
  } else if (value >= 1000000) {
    return formatter.format(value / 1000000) + 'M';
  }
  
  return formatter.format(value);
}

/**
 * Get YouTube channel URL from channel ID
 */
export function getYouTubeURL(channelId: string): string {
  return `https://www.youtube.com/channel/${channelId}`;
}

/**
 * Get confidence level based on status
 */
export function getConfidenceLevel(status: string): 'high' | 'medium' | 'low' {
  switch (status) {
    case 'confirmed':
      return 'high';
    case 'rumored':
    case 'pending':
      return 'medium';
    case 'withdrawn':
    case 'denied':
      return 'low';
    default:
      return 'low';
  }
}
