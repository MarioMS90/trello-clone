import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function BoardPage() {
  const { workspaces, selectedWorkspaceId } = useWorkspacesStore(store => store);
  const selectedWorkspace = workspaces.find(workspace => workspace.id === selectedWorkspaceId);

  return <div>My Board</div>;
}
