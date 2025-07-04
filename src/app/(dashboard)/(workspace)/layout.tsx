import { membersKeys, userKeys } from '@/modules/user/lib/queries';
import getQueryClient from '@/modules/common/lib/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import DynamicWorkspaceSidebar from '@/modules/sidebar/components/dynamic-sidebar';

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
      <DynamicWorkspaceSidebar />
      <main className="bg-main-background grow text-white">{children}</main>
    </HydrationBoundary>
  );
}
