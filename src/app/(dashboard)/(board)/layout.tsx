import BoardHeader from '@/components/dashboard/board/board-header';
import { Suspense } from 'react';

export default function BoardsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<>Skeleton sano</>}>
        <BoardHeader />
      </Suspense>
      {children}
    </>
  );
}
