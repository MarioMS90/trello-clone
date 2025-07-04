import { Suspense } from 'react';
import { Boards } from '@/modules/board/components/boards';
import { BoardsSkeleton } from '@/modules/common/components/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
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
