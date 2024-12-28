import { Metadata } from 'next';
import { Suspense } from 'react';
import { TaskListsSkeleton } from '@/components/ui/skeletons';
import Board from '@/components/dashboard/board/board';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;

  return (
    <Suspense fallback={<TaskListsSkeleton />}>
      <Board boardId={boardId} />
    </Suspense>
  );
}
