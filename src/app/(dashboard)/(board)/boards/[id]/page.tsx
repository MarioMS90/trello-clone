import { Metadata } from 'next';
import { Suspense } from 'react';
import { ListsSkeleton } from '@/components/ui/skeletons';
import Board from '@/components/dashboard/board/board';
import getQueryClient from '@/lib/react-query/get-query-client';
import { listKeys } from '@/lib/list/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import { boardKeys } from '@/lib/board/queries';
import { userKeys } from '@/lib/user/queries';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Board',
};

export default async function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery({ ...userKeys.auth(), staleTime: 0 });
  const boards = await queryClient.fetchQuery(boardKeys.list(user.id));
  const board = boards.find(_board => _board.id === boardId);
  if (!board) {
    notFound();
  }

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
