import { HeaderSkeleton } from '@/modules/common/components/ui/skeletons';
import { Suspense } from 'react';
import getQueryClient from '@/modules/common/lib/react-query/get-query-client';
import { userKeys } from '@/modules/user/lib/queries';
import { workspaceKeys } from '@/modules/workspace/lib/queries';
import { boardKeys, starredBoardKeys } from '@/modules/board/lib/queries';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { RealTimeProvider } from '@/modules/common/lib/real-time/providers/real-time-provider';
import Header from '@/modules/header/components/header';
import ReactQueryProvider from '@/modules/common/lib/react-query/providers/react-query-provider';

export default function DashboardLayout({
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
