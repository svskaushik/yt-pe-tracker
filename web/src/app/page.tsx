import { Suspense } from 'react';
import { getChannelsServer, getPEFirmsServer } from '../lib/channelData';
import { ClientChannelGrid } from '../components/ClientChannelGrid';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const channels = await getChannelsServer();
  const peFirms = await getPEFirmsServer();

  // Calculate stats
  const stats = {
    totalChannels: channels.length,
    confirmedDeals: channels.filter(c => c.status === 'confirmed').length,
    totalFirms: peFirms.length,
    totalSubscribers: channels.reduce((sum, c) => sum + (c.subscriber_count || 0), 0),
  };

  return (
    <div className='min-h-screen bg-[var(--background)]'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 py-16 sm:py-24'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center max-w-4xl mx-auto'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-6'>
              YouTube <span className='text-[var(--primary)]'>PE Tracker</span>
            </h1>
            <p className='text-lg sm:text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto'>
              Community-driven database tracking private equity acquisitions and investments in
              YouTube channels
            </p>

            {/* Quick Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-12'>
              <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
                <div className='text-2xl font-bold text-[var(--foreground)]'>{stats.totalChannels}</div>
                <div className='text-sm text-[var(--muted-foreground)]'>Tracked Channels</div>
              </div>
              <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
                <div className='text-2xl font-bold text-[var(--foreground)]'>{stats.confirmedDeals}</div>
                <div className='text-sm text-[var(--muted-foreground)]'>Confirmed Deals</div>
              </div>
              <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
                <div className='text-2xl font-bold text-[var(--foreground)]'>{stats.totalFirms}</div>
                <div className='text-sm text-[var(--muted-foreground)]'>PE Firms</div>
              </div>
              <div className='bg-[var(--card)]/80 backdrop-blur-sm rounded-lg p-4 border border-[var(--border)]'>
                <div className='text-2xl font-bold text-[var(--foreground)]'>
                  {stats.totalSubscribers > 1000000
                    ? `${(stats.totalSubscribers / 1000000).toFixed(1)}M`
                    : `${Math.round(stats.totalSubscribers / 1000)}K`}
                </div>
                <div className='text-sm text-[var(--muted-foreground)]'>Total Subscribers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-12'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Search, Filter and Channels Grid */}
          <Suspense
            fallback={
              <div className='space-y-8'>
                <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-6'>
                  <div className='animate-pulse'>
                    <div className='h-10 bg-[var(--muted)] rounded mb-4'></div>
                    <div className='flex gap-2'>
                      <div className='h-8 bg-[var(--muted)] rounded w-20'></div>
                      <div className='h-8 bg-[var(--muted)] rounded w-20'></div>
                      <div className='h-8 bg-[var(--muted)] rounded w-20'></div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 animate-pulse'
                    >
                      <div className='h-6 bg-[var(--muted)] rounded mb-4'></div>
                      <div className='h-4 bg-[var(--muted)] rounded mb-2'></div>
                      <div className='h-4 bg-[var(--muted)] rounded w-3/4'></div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ClientChannelGrid initialChannels={channels} peFirms={peFirms} />
          </Suspense>

          {/* Call to Action */}
          <div className='mt-16 text-center'>
            <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-8'>
              <h2 className='text-2xl font-bold text-[var(--foreground)] mb-4'>
                Know of a PE acquisition we're missing?
              </h2>
              <p className='text-[var(--muted-foreground)] mb-6 max-w-2xl mx-auto'>
                Help us keep this database accurate and up-to-date by submitting new acquisitions or
                corrections.
              </p>
              <a
                href='/submit'
                className='inline-flex items-center gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-3 rounded-lg font-semibold hover:bg-[var(--primary)/0.9] transition-colors'
              >
                <span>🏢</span>
                Submit a Channel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
