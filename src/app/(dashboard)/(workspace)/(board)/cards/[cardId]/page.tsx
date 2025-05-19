import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeletons';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Card from '@/components/dashboard/card/card';
import getQueryClient from '@/lib/react-query/get-query-client';
import { cardKeys } from '@/lib/card/queries';

export const metadata: Metadata = {
  title: 'Card',
};

export default async function CardPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;
  const queryClient = getQueryClient();
  queryClient.fetchQuery(cardKeys.detail(cardId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<CardSkeleton />}>
        <Card cardId={cardId} />
      </Suspense>
    </HydrationBoundary>
  );
}
