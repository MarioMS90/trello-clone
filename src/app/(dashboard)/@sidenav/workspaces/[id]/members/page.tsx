import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';
import { WorkspacePageNames } from '@/constants/constants';

export default function MembersSidenavPage({ params }: { params: { id: string } }) {
  return <WorkspaceSideNav workspaceId={params.id} actualPageName={WorkspacePageNames.MEMBERS} />;
}
