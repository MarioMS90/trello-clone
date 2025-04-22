import { Metadata } from 'next';
import { Suspense } from 'react';
import { ListsSkeleton } from '@/components/ui/skeletons';
import Board from '@/components/dashboard/board/board';
import getQueryClient from '@/lib/react-query/get-query-client';
import { listKeys } from '@/lib/list/queries';
import { cardKeys } from '@/lib/card/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(listKeys.list(boardId));
  queryClient.prefetchQuery(cardKeys.list(boardId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ListsSkeleton />}>
        <Board boardId={boardId} />
      </Suspense>
    </HydrationBoundary>
  );
}
