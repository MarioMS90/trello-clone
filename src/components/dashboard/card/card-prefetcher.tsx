import getQueryClient from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cardKeys } from '@/lib/card/queries';
import Card from '@/components/dashboard/card/card';

export default async function CardPrefetcher({ cardId }: { cardId: string }) {
  const queryClient = getQueryClient();
  queryClient.fetchQuery(cardKeys.detail(cardId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card cardId={cardId} />
    </HydrationBoundary>
  );
}
