import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebar';
import { getWorkspace, getWorkspaceIdFromBoard } from '@/lib/server-utils';
import { notFound } from 'next/navigation';

export default async function SidebarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;
  const targetWorkspaceId = await getWorkspaceIdFromBoard(boardId);
  const workspace = await getWorkspace(targetWorkspaceId);

  if (!workspace) {
    notFound();
  }

  return <WorkspaceSidebar workspace={workspace} boardId={boardId} />;
}
