'use client';

import { BoardHeaderSkeleton } from '@/modules/common/components/ui/skeletons';
import dynamic from 'next/dynamic';

const BoardHeader = dynamic(() => import('./board-header'), {
  ssr: false,
  loading: () => <BoardHeaderSkeleton />,
});

export default function DynamicBoardHeader() {
  return <BoardHeader />;
}
