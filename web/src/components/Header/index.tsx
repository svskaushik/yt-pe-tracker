/* eslint-disable simple-import-sort/imports */

'use client';

import Link from 'next/link';
import type { FC } from 'react';

import type { CurrentUserProps } from '@/types';

const Header: FC<CurrentUserProps> = () => {
  return (
    <header className="px-8 py-8 flex justify-between bg-background text-foreground dark:bg-[#181A20] dark:text-white">
      <Link href='/'>
        <span>Home</span>
      </Link>
      <button
        className="bg-foreground text-background dark:bg-white dark:text-[#181A20] px-4 py-2 rounded-md transition-colors"
        type="button"
      >
        Login
      </button>
    </header>
  );
};

export default Header;
