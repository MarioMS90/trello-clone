import { fetchWorkspaceWithTasks } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default async function Page({ params }: { params: { id: string } }) {
  const workspace = await fetchWorkspaceWithTasks(params.id);
  return <div>Selected workspace: {workspace.name}</div>;
}
