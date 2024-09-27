import { useWorkspacesStore } from '@/stores/workspaces-store';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function BoardPage({ params }: { params: { id: string } }) {
  const { workspaces, setSelectedWorkspace } = useWorkspacesStore();
  const selectedWorkspaceId = workspaces.find(workspace => )
  setSelectedWorkspaceId(workspaces)

  return <div>My Board: {params.id}</div>;
}
