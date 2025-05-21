import { membersKeys, userKeys } from '@/lib/user/queries';
import getQueryClient from '@/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import DynamicSidebar from '@/components/dashboard/sidebar/dynamic-sidebar';

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  queryClient.prefetchQuery(userKeys.list);
  queryClient.prefetchQuery(membersKeys.list);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DynamicSidebar />
      <main className="bg-main-background grow text-white">{children}</main>
    </HydrationBoundary>
  );
}
