import { use, Suspense } from 'react';
import { Boards } from '@/components/dashboard/boards';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Board',
};

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <>
      <h2 className="font-bold">Boards</h2>
      <Suspense fallback={<BoardsSkeleton />}>
        <Boards workspaceId={id} />
      </Suspense>
    </>
  );
}
