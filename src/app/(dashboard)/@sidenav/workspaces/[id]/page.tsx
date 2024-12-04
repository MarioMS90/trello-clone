import { WorkspacePageNames } from '@/constants/constants';
import { SidebarSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebar';

export default async function WorkspaceSidenavPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = await params;

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <WorkspaceSidebar workspaceId={workspaceId} actualPageName={WorkspacePageNames.BOARDS} />
    </Suspense>
  );
}
