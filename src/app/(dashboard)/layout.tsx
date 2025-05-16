import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { RealTimeProvider } from '@/providers/real-time-provider';
import getQueryClient from '@/lib/react-query/get-query-client';
import { userKeys } from '@/lib/user/queries';
import { workspaceKeys } from '@/lib/workspace/queries';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(userKeys.current);
  queryClient.prefetchQuery(workspaceKeys.list);
  queryClient.prefetchQuery(boardKeys.list);
  queryClient.prefetchQuery(starredBoardKeys.list);

  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RealTimeProvider>
          <div className="flex h-dvh flex-col">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>
            <div className="flex grow">{children}</div>
          </div>
        </RealTimeProvider>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
