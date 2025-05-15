import { SidebarSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar/workspace-sidebar';
import { membersKeys, userKeys } from '@/lib/user/queries';
import getQueryClient from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery(userKeys.list);
  queryClient.prefetchQuery(membersKeys.list);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<SidebarSkeleton />}>
        <WorkspaceSidebar />
      </Suspense>
      <main className="bg-main-background grow text-white">{children}</main>
    </HydrationBoundary>
  );
}
