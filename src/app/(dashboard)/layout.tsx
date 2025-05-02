import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import ReactQueryProvider from '@/providers/react-query-provider';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/react-query/get-query-client';
import { userKeys } from '@/lib/user/queries';
import { userWorkspaceKeys, workspaceKeys } from '@/lib/workspace/queries';
import { boardKeys, starredBoardKeys } from '@/lib/board/queries';
import { RealTimeProvider } from '@/providers/real-time-provider';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';
import { authKeys } from '@/lib/auth/queries';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  const user = await queryClient.fetchQuery({ ...authKeys.user(), staleTime: 0 });
  const workspaces = await queryClient.fetchQuery(workspaceKeys.list(user.id));
  const workspaceIds = workspaces.map(workspace => workspace.id);

  queryClient.prefetchQuery(userKeys.detail(user.id));
  queryClient.prefetchQuery(userKeys.list(workspaceIds));
  queryClient.prefetchQuery(userWorkspaceKeys.list(workspaceIds));
  queryClient.prefetchQuery(boardKeys.list(user.id));
  queryClient.prefetchQuery(starredBoardKeys.list(user.id));

  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RealTimeProvider>
          <div className="flex h-dvh flex-col">
            <Suspense fallback={<HeaderSkeleton />}>
              <Header userId={user.id} />
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
