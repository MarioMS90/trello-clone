import { Metadata } from 'next';
import { Suspense } from 'react';
import { ListsSkeleton } from '@/modules/common/components/ui/skeletons';
import Board from '@/modules/board/components/board';
import getQueryClient from '@/modules/common/lib/react-query/get-query-client';
import { listKeys } from '@/modules/list/lib/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cardKeys } from '@/modules/card/lib/queries';

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
