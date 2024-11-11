import Link from 'next/link';
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div
      className='w-[72px] h-dvh bg-theme-black'>
      <ul>
        <li>
          <Link href="/">
            home
          </Link>

        </li>
        <li>
          <Link href="/chat">
            chat
          </Link>
        </li>
        <li>
          <Link href="/flow">
            flow
          </Link>
        </li>
        <li>
          <Link href="/settings">
            setting
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;