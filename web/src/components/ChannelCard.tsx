import * as React from 'react';
import Link from 'next/link';
import { ChannelData, formatSubscriberCount, formatDealValue, getYouTubeURL, getConfidenceLevel } from '@/lib/getChannels';
import { ConfidenceBadge } from '@/components/ui/confidence-badge';

interface ChannelCardProps {
  channel: ChannelData;
  className?: string;
}

function ChannelCard({ channel, className }: ChannelCardProps) {
  const confidence = getConfidenceLevel(channel.status);
  const youtubeUrl = getYouTubeURL(channel.channel_id);
  
  return (
    <div className={`bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow duration-200 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {channel.channel_name}
          </h3>
          {channel.channel_handle && (
            <p className="text-sm text-muted-foreground mt-1">
              {channel.channel_handle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <ConfidenceBadge 
            confidence={confidence} 
            status={channel.status}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">👥</span>
          <span className="font-medium">
            {formatSubscriberCount(channel.subscriber_count)}
          </span>
          <span className="text-muted-foreground">subscribers</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">🏢</span>
          <Link 
            href={`/firm/${encodeURIComponent(channel.pe_firm.toLowerCase().replace(/\s+/g, '-'))}`}
            className="font-medium text-primary hover:underline"
          >
            {channel.pe_firm}
          </Link>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">📅</span>
          <span className="text-muted-foreground">
            {new Date(channel.acquisition_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">💰</span>
          <span className="text-muted-foreground">
            {formatDealValue(channel.deal_value, channel.deal_value_currency)}
          </span>
        </div>
      </div>

      {/* Acquisition Type */}
      <div className="mb-4">
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
          {channel.acquisition_type.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Tags */}
      {channel.tags && channel.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {channel.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
          {channel.tags.length > 3 && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
              +{channel.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      {channel.notes && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {channel.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <Link
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View Channel 🔗
          </Link>
          
          <Link
            href={channel.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Source 🔗
          </Link>
        </div>

        <div className="text-xs text-muted-foreground">
          {channel.verified_by && `Verified by ${channel.verified_by}`}
        </div>
      </div>
    </div>
  );
}

export { ChannelCard };
