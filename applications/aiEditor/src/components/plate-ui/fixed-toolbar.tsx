'use client';

import { withCn } from '@udecode/cn';

import { Toolbar } from './toolbar';

export const FixedToolbar = withCn(
  Toolbar,
  ` bg-white sticky left-0 top-0 w-[720px] z-50 w-full justify-between overflow-x-auto rounded-t-lg border-b border-b-border  p-1 scrollbar-hide`
);
