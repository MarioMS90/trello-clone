import { WorkspacePageNames } from '@/constants/constants';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar';
import { SidebarSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

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
