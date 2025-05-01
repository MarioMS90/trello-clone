import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/react-query/get-query-client';
import { userKeys } from '@/lib/user/queries';
import { workspaceKeys } from '@/lib/workspace/queries';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { RealTimeProvider } from '@/providers/real-time-provider';
import { MainSidebar, Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { ErrorBoundary } from 'react-error-boundary';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery({ ...userKeys.auth(), staleTime: 0 });
  queryClient.prefetchQuery(userKeys.detail(user.id));
  queryClient.prefetchQuery(workspaceKeys.list(user.id));
  queryClient.prefetchQuery(boardKeys.list(user.id));
  queryClient.prefetchQuery(starredBoardKeys.list(user.id));

  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RealTimeProvider>
          <div className="flex h-dvh flex-col">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header />
            </Suspense>

            <main className="flex grow">
              <ErrorBoundary fallback={<MainSidebar />}>
                <Suspense fallback={<SidebarSkeleton />}>
                  <Sidebar />
                </Suspense>
              </ErrorBoundary>
              <div className="grow bg-main-background text-white">{children}</div>
            </main>
          </div>
        </RealTimeProvider>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
