'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full border-t border-[var(--border)] bg-[var(--background)] py-6 text-[var(--muted-foreground)]'>
      <div className='container flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 max-w-full'>
        <div className='flex items-center space-x-2'>
          <span className='font-bold font-poppins text-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent'>
            YouTube PE Tracker
          </span>
        </div>
        <nav className='flex items-center space-x-6' aria-label='Footer navigation'>
          <Link
            href='/about'
            className='hover:text-[var(--primary)] transition-colors duration-200'
          >
            About
          </Link>
          <Link
            href='/submit'
            className='hover:text-[var(--primary)] transition-colors duration-200'
          >
            Submit Channel
          </Link>
          <a
            href='https://github.com/svskaushik/yt-pe-tracker'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-[var(--primary)] transition-colors duration-200'
            aria-label='GitHub Repository'
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
