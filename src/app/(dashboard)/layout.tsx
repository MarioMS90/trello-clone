import Header from '@/components/dashboard/header/header';
import { HeaderSkeleton, LayoutSkeleton } from '@/components/ui/skeletons';
import { fetchBoards, fetchUser, fetchWorkspaces } from '@/lib/data';
import { getQueryClient } from '@/providers/get-query-client';
import ReactQueryProvider from '@/providers/react-query-provider';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
  sidebar,
}: Readonly<{
  children: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  queryClient.prefetchQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });
  queryClient.prefetchQuery({
    queryKey: ['workspaces'],
    queryFn: fetchWorkspaces,
  });
  queryClient.prefetchQuery({
    queryKey: ['boards'],
    queryFn: fetchBoards,
  });

  return (
    <ReactQueryProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex h-dvh flex-col">
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>

          {/* <main className="z-0 flex grow">
          {sidebar} Pending
          <div className="grow bg-main-background text-white">{children}</div>
        </main> */}
        </div>
      </HydrationBoundary>
    </ReactQueryProvider>
  );
}
