'use client';

import { useState } from 'react';
import { ChannelCard } from '../components/ChannelCard';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { ChannelData } from '../lib/channelData';

interface ClientChannelGridProps {
  initialChannels: ChannelData[];
  peFirms: string[];
}

export function ClientChannelGrid({ initialChannels, peFirms }: ClientChannelGridProps) {
  const [filteredChannels, setFilteredChannels] = useState<ChannelData[]>(initialChannels);

  return (
    <>
      {/* Search and Filter */}
      <div className="mb-8">
        <SearchAndFilter 
          channels={initialChannels} 
          peFirms={peFirms} 
          onFilterChange={setFilteredChannels}
        />
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChannels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>

      {/* No Results */}
      {filteredChannels.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No channels found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </>
  );
}
