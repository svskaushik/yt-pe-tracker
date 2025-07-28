'use client';

import Link from 'next/link';

export default function MainFooter() {
  return (
    <footer className="w-full py-8 bg-[var(--card)] border-t border-[var(--border)]">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 max-w-full">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-[var(--foreground)] font-poppins">
            YouTube PE Tracker
          </span>
          <span className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Community Project
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link
            href="/submit"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200"
          >
            Submit Channel
          </Link>
          <Link
            href="https://github.com/yourusername/yt-pe-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200"
          >
            GitHub
          </Link>
          <Link
            href="/about"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-200"
          >
            About
          </Link>
        </nav>
      </div>
    </footer>
  );
}
