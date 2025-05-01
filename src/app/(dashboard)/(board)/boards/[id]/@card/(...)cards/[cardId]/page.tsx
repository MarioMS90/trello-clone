import { Metadata } from 'next';
import { Suspense } from 'react';
import CardPrefetcher from '@/components/dashboard/card/card-prefetcher';
import { CardSkeleton } from '@/components/ui/skeletons';

export const metadata: Metadata = {
  title: 'Card',
};

export default async function CardModal({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;

  return (
    <Suspense fallback={<CardSkeleton />}>
      <CardPrefetcher cardId={cardId} />
    </Suspense>
  );
}
