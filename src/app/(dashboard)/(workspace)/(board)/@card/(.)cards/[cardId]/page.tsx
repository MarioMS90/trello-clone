import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeletons';
import CardPrefetcher from '@/components/dashboard/card/card-prefetcher';

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
