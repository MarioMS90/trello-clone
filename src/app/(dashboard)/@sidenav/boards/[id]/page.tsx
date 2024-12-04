import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebar';

export default async function BoardSidenavPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;

  return <WorkspaceSidebar boardId={boardId} />;
}
