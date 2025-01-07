import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebars';
import { getWorkspace } from '@/lib/server-utils';
import { notFound } from 'next/navigation';

export default async function SidebarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: workspaceId } = await params;
  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    notFound();
  }

  return <WorkspaceSidebar workspace={workspace} />;
}
