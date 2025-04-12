import { Suspense } from 'react';
import { Boards } from '@/components/dashboard/board/boards';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardsPage() {
  return (
    <div className="main-container">
      <h2 className="font-bold">Boards</h2>
      <Suspense fallback={<BoardsSkeleton />}>
        <Boards />
      </Suspense>
    </div>
  );
}
