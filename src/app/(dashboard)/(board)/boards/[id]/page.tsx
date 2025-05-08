import { Metadata } from 'next';
import { Suspense } from 'react';
import { ListsSkeleton } from '@/components/ui/skeletons';
import Board from '@/components/dashboard/board/board';
import BoardHeader from '@/components/dashboard/board/board-header';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;

  return (
    <>
      <Suspense fallback={null}>
        <BoardHeader />
      </Suspense>
      <Suspense fallback={<ListsSkeleton />}>
        <Board boardId={boardId} />
      </Suspense>
    </>
  );
}
