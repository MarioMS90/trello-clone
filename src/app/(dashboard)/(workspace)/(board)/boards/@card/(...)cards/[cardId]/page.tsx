import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeletons';
import Card from '@/components/dashboard/card/card';

export const metadata: Metadata = {
  title: 'Card',
};

export default async function CardModal({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;

  return (
    <Suspense fallback={<CardSkeleton />}>
      <Card cardId={cardId} />
    </Suspense>
  );
}
