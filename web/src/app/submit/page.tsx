import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export const metadata = {
  title: 'Submit Channel | YouTube PE Tracker',
  description:
    'Submit a new YouTube channel acquisition or investment for review and inclusion in our database.',
};

export default function SubmitPage() {
  // Pre-filled GitHub issue URL
  const githubIssueUrl =
    'https://github.com/svskaushik/yt-pe-tracker/issues/new?template=channel-submission.md&title=%5BSubmission%5D%20New%20Channel%20Acquisition';

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

          <h1 className='text-3xl font-bold text-[var(--foreground)] mb-2'>Submit a Channel</h1>
          <p className='text-[var(--muted-foreground)]'>
            Help us track YouTube channel acquisitions and investments
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Instructions */}
          <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 mb-8'>
            <h2 className='text-xl font-semibold text-[var(--foreground)] mb-4'>📋 Submission Guidelines</h2>
            <div className='space-y-3 text-[var(--muted-foreground)]'>
              <p>
                <strong>What we track:</strong> Private equity acquisitions, investments,
                partnerships, and management deals involving YouTube channels.
              </p>
              <p>
                <strong>Required information:</strong> Channel name, PE firm, acquisition type,
                date, and credible source (news article, press release, etc.).
              </p>
              <p>
                <strong>Quality standards:</strong> All submissions are reviewed for accuracy.
                Please provide multiple sources when available.
              </p>
            </div>
          </div>

          {/* Information Form */}
          <div className='bg-[var(--card)] rounded-lg border border-[var(--border)] p-6 mb-8'>
            <h2 className='text-xl font-semibold text-[var(--foreground)] mb-6'>📝 Required Information</h2>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-[var(--foreground)]'>Channel Details</h3>
                <ul className='space-y-2 text-[var(--muted-foreground)] text-sm'>
                  <li>• Channel name and handle</li>
                  <li>• YouTube channel URL</li>
                  <li>• Subscriber count (approximate)</li>
                  <li>• Content category/niche</li>
                </ul>
              </div>

              <div className='space-y-4'>
                <h3 className='font-semibold text-[var(--foreground)]'>Deal Details</h3>
                <ul className='space-y-2 text-[var(--muted-foreground)] text-sm'>
                  <li>• PE firm name</li>
                  <li>• Acquisition/investment date</li>
                  <li>• Deal type (acquisition, partnership, etc.)</li>
                  <li>• Deal value (if disclosed)</li>
                </ul>
              </div>

              <div className='space-y-4'>
                <h3 className='font-semibold text-[var(--foreground)]'>Sources</h3>
                <ul className='space-y-2 text-[var(--muted-foreground)] text-sm'>
                  <li>• News articles</li>
                  <li>• Press releases</li>
                  <li>• Official announcements</li>
                  <li>• Industry reports</li>
                </ul>
              </div>

              <div className='space-y-4'>
                <h3 className='font-semibold text-[var(--foreground)]'>Additional Info</h3>
                <ul className='space-y-2 text-[var(--muted-foreground)] text-sm'>
                  <li>• Deal context/background</li>
                  <li>• Strategic rationale</li>
                  <li>• Post-acquisition changes</li>
                  <li>• Your name (optional credit)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='text-center'>
            <div className='bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 rounded-lg p-8 border border-[var(--border)]'>
              <h2 className='text-2xl font-bold text-[var(--foreground)] mb-4'>Ready to Submit?</h2>
              <p className='text-[var(--muted-foreground)] mb-6 max-w-2xl mx-auto'>
                 Click the button below to open a pre-filled GitHub issue. This helps us track
                 submissions and maintain data quality through our review process.
               </p>

              <a
                href={githubIssueUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-3 bg-[var(--primary)] text-[var(--primary-foreground)] px-8 py-4 rounded-lg font-semibold hover:bg-[var(--primary)/0.9] transition-colors text-lg'
              >
                <span>🚀</span>
                Submit via GitHub Issue
                <span>↗</span>
              </a>

              <p className='text-xs text-[var(--muted-foreground)] mt-4'>
                 Requires a GitHub account. Issues are public and help maintain transparency.
               </p>
            </div>
          </div>

          {/* Community Section */}
          <div className='mt-12 bg-[var(--card)] rounded-lg border border-[var(--border)] p-6'>
            <h2 className='text-xl font-semibold text-[var(--foreground)] mb-4'>🤝 Join the Community</h2>
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='text-center'>
                <div className='text-2xl mb-2'>📊</div>
                <h3 className='font-semibold text-[var(--foreground)] mb-2'>Data Contributors</h3>
                <p className='text-sm text-[var(--muted-foreground)]'>
                  Help build the most comprehensive database of YouTube PE activity
                </p>
              </div>
              <div className='text-center'>
                <div className='text-2xl mb-2'>🔍</div>
                <h3 className='font-semibold text-[var(--foreground)] mb-2'>Researchers</h3>
                <p className='text-sm text-[var(--muted-foreground)]'>
                  Verify sources and ensure data accuracy through peer review
                </p>
              </div>
              <div className='text-center'>
                <div className='text-2xl mb-2'>🛠️</div>
                <h3 className='font-semibold text-[var(--foreground)] mb-2'>Developers</h3>
                <p className='text-sm text-[var(--muted-foreground)]'>
                  Contribute to platform improvements and new features
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='mt-8 bg-[var(--card)] rounded-lg border border-[var(--border)] p-6'>
            <h2 className='text-xl font-semibold text-[var(--foreground)] mb-4'>
               ❓ Frequently Asked Questions
             </h2>
             <div className='space-y-4'>
               <div>
                <h3 className='font-semibold text-[var(--foreground)] text-sm mb-1'>
                   How long does review take?
                 </h3>
                <p className='text-[var(--muted-foreground)] text-sm'>
                   Most submissions are reviewed within 7-14 days, depending on the complexity and
                   source verification required.
                 </p>
               </div>

               <div>
                <h3 className='font-semibold text-[var(--foreground)] text-sm mb-1'>
                   What if I don't have all the information?
                 </h3>
                <p className='text-[var(--muted-foreground)] text-sm'>
                   Submit what you have! We can work together to fill in missing details or find
                   additional sources.
                 </p>
               </div>

               <div>
                <h3 className='font-semibold text-[var(--foreground)] text-sm mb-1'>
                   Can I submit corrections to existing entries?
                 </h3>
                <p className='text-[var(--muted-foreground)] text-sm'>
                   Absolutely! Use the same submission process and specify that you're correcting
                   existing data.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
  );
}
