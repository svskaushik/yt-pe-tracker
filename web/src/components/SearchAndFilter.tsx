'use client';

import { useState, useMemo } from 'react';
import { ChannelData } from '../lib/channelData';

interface SearchAndFilterProps {
  channels: ChannelData[];
  peFirms: string[];
  onFilterChange?: (filteredChannels: ChannelData[]) => void;
}

export function SearchAndFilter({ 
  channels, 
  peFirms, 
  onFilterChange 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFirm, setSelectedFirm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const filteredChannels = useMemo(() => {
    let filtered = channels;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(channel =>
        channel.channel_name.toLowerCase().includes(query) ||
        channel.channel_handle?.toLowerCase().includes(query) ||
        channel.pe_firm.toLowerCase().includes(query) ||
        channel.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply firm filter
    if (selectedFirm) {
      filtered = filtered.filter(channel => channel.pe_firm === selectedFirm);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(channel => channel.status === selectedStatus);
    }

    return filtered;
  }, [channels, searchQuery, selectedFirm, selectedStatus]);

  // Notify parent component of filter changes
  if (onFilterChange) {
    onFilterChange(filteredChannels);
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Search channels
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Search channels, firms, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-foreground">🔍</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* PE Firm Filter */}
          <div className="min-w-[200px]">
            <label htmlFor="firm" className="sr-only">
              Filter by PE firm
            </label>
            <select
              id="firm"
              value={selectedFirm}
              onChange={(e) => setSelectedFirm(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All PE Firms</option>
              {peFirms.map((firm) => (
                <option key={firm} value={firm}>
                  {firm}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[150px]">
            <label htmlFor="status" className="sr-only">
              Filter by status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="rumored">Rumored</option>
              <option value="pending">Pending</option>
              <option value="withdrawn">Withdrawn</option>
              <option value="denied">Denied</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center text-sm text-muted-foreground">
            Showing {filteredChannels.length} of {channels.length} channels
          </div>
        </div>

        {/* Active filters */}
        {(searchQuery || selectedFirm || selectedStatus) && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            )}
            {selectedFirm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Firm: {selectedFirm}
                <button
                  onClick={() => setSelectedFirm('')}
                  className="ml-1 hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus('')}
                  className="ml-1 hover:text-primary/80"
                >
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFirm('');
                setSelectedStatus('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
