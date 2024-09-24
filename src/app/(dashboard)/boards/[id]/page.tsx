import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boards',
};

export default function Page({ params }: { params: { id: string } }) {
  const { workspaces, setSelectedWorkspaceId } = useWorkspacesStore(state => state);
  const selectedWorkspaceId = workspaces.find(workspace => )
  setSelectedWorkspaceId(workspaces.f)

  return <div>My Board: {params.id}</div>;
}
