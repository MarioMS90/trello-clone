import { use } from 'react';
import { WorkspaceSidebar } from '@/components/dashboard/sidebar';

export default function BoardSidenavPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = use(params);
  return <WorkspaceSidebar boardId={boardId} />;
}
