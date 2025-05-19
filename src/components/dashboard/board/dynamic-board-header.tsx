'use client';

import dynamic from 'next/dynamic';

const BoardHeader = dynamic(() => import('./board-header'), { ssr: false });

export default function DynamicBoardHeader() {
  return <BoardHeader />;
}
