import { use } from 'react';
import { WorkspacePageNames } from '@/constants/constants';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar';

export default function WorkspaceSidenavPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = use(params);
  return <WorkspaceSidebar workspaceId={workspaceId} actualPageName={WorkspacePageNames.BOARDS} />;
}
