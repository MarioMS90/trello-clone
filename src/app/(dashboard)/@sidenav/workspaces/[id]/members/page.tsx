import { WorkspacePageNames } from '@/constants/constants';
import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';

export default function WorkspaceSidenavPage({ params }: { params: { id: string } }) {
  return <WorkspaceSideNav workspaceId={params.id} actualPageName={WorkspacePageNames.MEMBERS} />;
}
