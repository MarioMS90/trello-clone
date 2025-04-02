import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/utils/react-query/get-query-client';
import { userKeys } from '@/lib/user/queries';
import { workspaceKeys } from '@/lib/workspace/queries';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { RealTimeProvider } from '@/providers/real-time-provider';

export default async function DashboardLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(userKeys.current());
  queryClient.prefetchQuery(workspaceKeys.list());
  queryClient.prefetchQuery(boardKeys.list());
  queryClient.prefetchQuery(starredBoardKeys.list());

  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RealTimeProvider>
          <div className="flex h-dvh flex-col">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>
            {children}

            {/* <main className="z-0 flex grow">
          {sidebar} Pending
          <div className="grow bg-main-background text-white">{children}</div>
        </main> */}
          </div>
        </RealTimeProvider>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
