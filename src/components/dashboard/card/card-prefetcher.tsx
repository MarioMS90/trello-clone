import getQueryClient from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import Card from '@/components/dashboard/card/card';
import { listKeys } from '@/lib/list/queries';
import { notFound } from 'next/navigation';

export default async function CardPrefetcher({ cardId }: { cardId: string }) {
  const queryClient = getQueryClient();
  const card = await queryClient.fetchQuery({
    ...cardKeys.detail(cardId),
  });

  if (!card) {
    notFound();
  }

  queryClient.prefetchQuery(listKeys.detail(card.listId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card cardId={cardId} />
    </HydrationBoundary>
  );
}
