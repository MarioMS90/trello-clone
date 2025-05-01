import { Metadata } from 'next';
import { Suspense } from 'react';
import CardPrefetcher from '@/components/dashboard/card/card-prefetcher';
import { CardSkeleton } from '@/components/ui/skeletons';
import { ErrorBoundary } from 'react-error-boundary';
import BoardHeader from '@/components/dashboard/board/board-header';

export const metadata: Metadata = {
  title: 'Card',
};

export default async function CardPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params;

  return (
    <>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={<>Skeleton board</>}>
          <BoardHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={null}>
        <Suspense fallback={<CardSkeleton />}>
          <CardPrefetcher cardId={cardId} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
