import { Metadata } from 'next';
import { Suspense } from 'react';
import { CardSkeleton } from '@/components/ui/skeletons';
import BoardHeader from '@/components/dashboard/board/board-header';
import Card from '@/components/dashboard/card/card';

export const metadata: Metadata = {
  title: 'Card',
};

export default async function CardPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;

  return (
    <>
      <Suspense fallback={null}>
        <BoardHeader />
      </Suspense>
      <Suspense fallback={<CardSkeleton />}>
        <Card cardId={cardId} />
      </Suspense>
    </>
  );
}
