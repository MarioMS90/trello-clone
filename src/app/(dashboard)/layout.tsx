import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/react-query/get-query-client';
import { rolesKeys, userKeys } from '@/lib/user/queries';
import { workspaceKeys } from '@/lib/workspace/queries';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { RealTimeProvider } from '@/providers/real-time-provider';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(userKeys.current);
  queryClient.prefetchQuery(userKeys.list);
  queryClient.prefetchQuery(rolesKeys.list);
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

            <main className="flex grow">
              <Suspense fallback={<SidebarSkeleton />}>
                <Sidebar />
              </Suspense>

              <div className="bg-main-background grow text-white">{children}</div>
            </main>
          </div>
        </RealTimeProvider>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
