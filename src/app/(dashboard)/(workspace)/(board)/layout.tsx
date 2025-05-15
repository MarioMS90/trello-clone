import BoardHeader from '@/components/dashboard/board/board-header';
import { Suspense } from 'react';

export default function BoardLayout({
  children,
  card,
}: Readonly<{
  children: React.ReactNode;
  card: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <BoardHeader />
      </Suspense>
      {children}
      {card}
    </>
  );
}
