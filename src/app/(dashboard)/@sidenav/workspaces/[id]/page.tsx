import { WorkspacePageNames } from '@/constants/constants';

import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebar';

export default async function WorkspaceSidenavPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: workspaceId } = await params;

  return <WorkspaceSidebar workspaceId={workspaceId} actualPageName={WorkspacePageNames.BOARDS} />;
}
