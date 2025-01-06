import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardListsSkeleton } from '@/components/ui/skeletons';
import Board from '@/components/dashboard/boards/board';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;

  return (
    <Suspense fallback={<CardListsSkeleton />}>
      <Board boardId={boardId} />
    </Suspense>
  );
}
