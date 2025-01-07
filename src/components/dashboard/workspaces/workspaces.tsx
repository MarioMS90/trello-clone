import { fetchWorkspaces } from '@/lib/data';
import { WorkspaceList } from './workspace-list';

export async function Workspaces() {
  const workspaces = await fetchWorkspaces();

  return <WorkspaceList workspaces={workspaces} />;
}
