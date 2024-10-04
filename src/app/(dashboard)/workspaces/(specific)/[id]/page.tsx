import { Boards } from '@/components/dashboard/boards';
import { BoardsSkeleton } from '@/components/dashboard/skeletons';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Board',
};

export default function BoardPage({ params }: { params: { id: string } }) {
  return (
    <>
      <h2 className="font-bold">Boards</h2>
      <Suspense fallback={<BoardsSkeleton />}>
        <Boards workspaceId={params.id} />
      </Suspense>
    </>
  );
}
