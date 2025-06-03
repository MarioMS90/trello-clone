import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardSkeleton } from '@/modules/common/components/ui/skeletons';
import Card from '@/modules/card/components/card';

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
