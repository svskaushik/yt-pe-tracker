import Link from 'next/link';

export const metadata = {
  title: 'About | YouTube PE Tracker',
  description:
    'Learn more about the YouTube PE Tracker project, its mission, and the community behind it.',
};
export default function AboutPage() {
  return (
    <main className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl'>
        <h1 className='text-3xl font-bold mb-4'>About YouTube PE Tracker</h1>
        <p className='mb-4'>
          YouTube PE Tracker is a community-driven project to track and surface YouTube channels
          that provide high-quality physical education (PE) content. Our goal is to make it easier
          for educators, students, and enthusiasts to discover valuable PE resources on YouTube.
        </p>
        <p className='mb-4'>
          This project is open source and contributions are welcome! If you know of a great PE
          channel that should be included, please use the{' '}
          <Link href='/submit' className='text-[var(--primary)] underline'>
            Submit Channel
          </Link>{' '}
          page.
        </p>
        <p className='mb-4'>
          You can find the source code and contribute on{' '}
          <a
            href='https://github.com/svskaushik/yt-pe-tracker'
            target='_blank'
            rel='noopener noreferrer'
            className='text-[var(--primary)] underline'
          >
            GitHub
          </a>
          .
        </p>
        <p className='mb-4'>
          For questions or feedback, please open an issue on GitHub or reach out via the contact
          information in the repository.
        </p>
        <section className='mt-8'>
          <h2 className='text-xl font-semibold text-foreground mb-2'>How It Works</h2>
          <ul className='list-disc pl-6 text-muted-foreground space-y-2'>
            <li>
              Anyone can submit new channels or corrections via our{' '}
              <Link href='/submit' className='text-primary hover:underline'>
                submission form
              </Link>
              .
            </li>
            <li>
              All submissions are reviewed for accuracy and require credible sources (news articles,
              press releases, etc.).
            </li>
            <li>Our team and community researchers verify and update the database regularly.</li>
          </ul>
        </section>
        <section className='mt-8'>
          <h2 className='text-xl font-semibold text-foreground mb-2'>Open Source & Community</h2>
          <p className='text-muted-foreground'>
            This project is open source and welcomes contributions from developers, data
            contributors, and researchers. Check out our{' '}
            <a
              href='https://github.com/svskaushik/yt-pe-tracker'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary hover:underline'
            >
              GitHub repository
            </a>{' '}
            to get involved.
          </p>
        </section>
        <section className='mt-8'>
          <h2 className='text-xl font-semibold text-foreground mb-2'>Contact & Support</h2>
          <p className='text-muted-foreground'>
            For questions, feedback, or partnership inquiries, please open an issue on GitHub or use
            the links in the footer.
          </p>
        </section>
        <p className='text-sm text-[var(--muted-foreground)] mt-8'>
          &copy; {new Date().getFullYear()} YouTube PE Tracker. Community project.
        </p>
      </div>
    </main>
  );
}
