import { Suspense } from 'react';
import { Boards } from '@/components/dashboard/boards/boards';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params;

  return (
    <div className="main-container">
      <h2 className="font-bold">Boards</h2>
      <Suspense fallback={<BoardsSkeleton />}>
        <Boards workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}
