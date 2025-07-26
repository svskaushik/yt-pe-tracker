import { readFileSync } from 'fs';
import { join } from 'path';

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
 * Server-side function to get channels data directly from file
 * This should only be used in server components or API routes
 */
export async function getChannelsServer(): Promise<ChannelsData> {
  try {
    const dataPath = join(process.cwd(), '..', 'data', 'channels.min.json');
    const jsonData = readFileSync(dataPath, 'utf-8');
    const data: ChannelsData = JSON.parse(jsonData);
    return data;
  } catch (error) {
    // Return empty data structure as fallback
    return {
      meta: {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        total_channels: 0,
        description: 'YouTube Channel Private Equity Ownership Database'
      },
      channels: []
    };
  }
}

/**
 * Client-side function to get channels data from API
 * This should be used in client components
 */
export async function getChannelsClient(): Promise<ChannelsData> {
  try {
    const response = await fetch('/api/channels');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch channels: ${response.status}`);
    }
    
    const data: ChannelsData = await response.json();
    return data;
  } catch (error) {
    // Return empty data structure as fallback
    return {
      meta: {
        generated_at: new Date().toISOString(),
        version: '1.0.0',
        total_channels: 0,
        description: 'YouTube Channel Private Equity Ownership Database'
      },
      channels: []
    };
  }
}

/**
 * Get channels filtered by PE firm (server-side)
 */
export async function getChannelsByFirmServer(firmName: string): Promise<ChannelData[]> {
  const data = await getChannelsServer();
  return data.channels.filter(
    (channel: ChannelData) => channel.pe_firm.toLowerCase() === firmName.toLowerCase()
  );
}

/**
 * Get unique PE firms (server-side)
 */
export async function getPEFirmsServer(): Promise<string[]> {
  const data = await getChannelsServer();
  const firms = Array.from(new Set(data.channels.map((channel: ChannelData) => channel.pe_firm)));
  return (firms as string[]).sort();
}

/**
 * Search channels by name or handle (server-side)
 */
export async function searchChannelsServer(query: string): Promise<ChannelData[]> {
  const data = await getChannelsServer();
  const searchTerm = query.toLowerCase();
  
  return data.channels.filter((channel: ChannelData) => 
    channel.channel_name.toLowerCase().includes(searchTerm) ||
    channel.channel_handle?.toLowerCase().includes(searchTerm) ||
    channel.pe_firm.toLowerCase().includes(searchTerm) ||
    channel.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
  );
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
