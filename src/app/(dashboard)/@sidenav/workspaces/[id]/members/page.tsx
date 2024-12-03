import { WorkspacePageNames } from '@/constants/constants';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar';
import { Suspense } from 'react';
import { SidebarSkeleton } from '@/components/ui/skeletons';

export default async function WorkspaceSidenavPageBoardSidenavPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = await params;

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <WorkspaceSidebar workspaceId={workspaceId} actualPageName={WorkspacePageNames.MEMBERS} />
    </Suspense>
  );
}
