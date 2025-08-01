import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { ChannelCard } from '../../../components/ChannelCard';
import { formatDealValue,getChannelsServer } from '../../../lib/channelData';

interface FirmPageProps {
  params: Promise<{ pe_firm: string }>;
}

export async function generateMetadata({ params }: FirmPageProps) {
  const { pe_firm } = await params;
  const firmName = decodeURIComponent(pe_firm).replace(/-/g, ' ');

  return {
    title: `${firmName} | YouTube PE Tracker`,
    description: `YouTube channels acquired by ${firmName}. View all acquisitions and investments made by this private equity firm.`,
  };
}

export default async function FirmPage({ params }: FirmPageProps) {
  const { pe_firm } = await params;
  const firmName = decodeURIComponent(pe_firm).replace(/-/g, ' ');

  // Get all channels and filter by firm
  const allChannels = await getChannelsServer();
  const firmChannels = allChannels.filter(
    channel => channel.pe_firm.toLowerCase() === firmName.toLowerCase()
  );

  // Calculate stats
  const totalChannels = firmChannels.length;
  const totalSubscribers = firmChannels.reduce(
    (sum, channel) => sum + (channel.subscriber_count || 0),
    0
  );
  const totalDeals = firmChannels.filter(
    channel => channel.deal_value && channel.deal_value > 0
  ).length;
  const totalValue = firmChannels.reduce((sum, channel) => sum + (channel.deal_value || 0), 0);

  if (firmChannels.length === 0) {
    return (
      <div className='min-h-screen bg-[var(--background)]'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='mb-8'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-[var(--border)] rounded-md px-4 py-2 font-medium transition-colors mb-4'
            >
              <ChevronLeft className='w-4 h-4' />
              Back to all channels
            </Link>

            <h1 className='text-3xl font-bold text-[var(--foreground)] mb-2'>{firmName}</h1>
            <p className='text-[var(--muted-foreground)]'>No channels found for this PE firm.</p>
          </div>

          <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-8 text-center'>
            <h2 className='text-xl font-semibold text-[var(--foreground)] mb-4'>No Acquisitions Found</h2>
            <p className='text-[var(--muted-foreground)] mb-6'>
              We don't have any recorded acquisitions for {firmName} yet.
            </p>
            <Link
              href='/submit'
              className='inline-flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary)/0.9] transition-colors'
            >
              <span>📝</span>
              Submit an acquisition
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        {/* Header */}
        <div className='mb-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] border border-[var(--border)] rounded-md px-4 py-2 font-medium transition-colors mb-4'
          >
            <ChevronLeft className='w-4 h-4' />
            Back to all channels
          </Link>

          <h1 className='text-3xl font-bold text-[var(--foreground)] mb-2'>{firmName}</h1>
          <p className='text-[var(--muted-foreground)]'>YouTube channel acquisitions and investments</p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
            <div className='text-2xl font-bold text-[var(--foreground)]'>{totalChannels}</div>
            <div className='text-sm text-[var(--muted-foreground)]'>Channels</div>
          </div>

          <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
            <div className='text-2xl font-bold text-[var(--foreground)]'>
              {(totalSubscribers / 1000000).toFixed(1)}M
            </div>
            <div className='text-sm text-[var(--muted-foreground)]'>Total Subscribers</div>
          </div>

          <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
            <div className='text-2xl font-bold text-[var(--foreground)]'>{totalDeals}</div>
            <div className='text-sm text-[var(--muted-foreground)]'>Disclosed Deals</div>
          </div>

          <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
            <div className='text-2xl font-bold text-[var(--foreground)]'>
              {totalValue > 0 ? formatDealValue(totalValue) : 'N/A'}
            </div>
            <div className='text-sm text-[var(--muted-foreground)]'>Total Value</div>
          </div>
        </div>

        {/* Channels Grid */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-[var(--foreground)] mb-6'>
            Acquired Channels ({totalChannels})
          </h2>

          <Suspense
            fallback={
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 animate-pulse'
                  >
                    <div className='h-6 bg-muted rounded mb-4'></div>
                    <div className='h-4 bg-muted rounded mb-2'></div>
                    <div className='h-4 bg-muted rounded w-3/4'></div>
                  </div>
                ))}
              </div>
            }
          >
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {firmChannels.map(channel => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </Suspense>
        </div>

        {/* Call to Action */}
        <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-8 text-center'>
          <h2 className='text-2xl font-bold text-[var(--foreground)] mb-4'>
            Know of more acquisitions by {firmName}?
          </h2>
          <p className='text-[var(--muted-foreground)] mb-6 max-w-2xl mx-auto'>
            Help us keep this database accurate and up-to-date by submitting additional acquisitions
            or corrections.
          </p>
          <Link
            href='/submit'
            className='inline-flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary)/0.9] transition-colors'
          >
            <span>📝</span>
            Submit an acquisition
          </Link>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
