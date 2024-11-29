import { use } from 'react';
import { WorkspaceSideNav } from '@/components/dashboard/sidenavs';

export default function BoardSidenavPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = use(params);
  return <WorkspaceSideNav boardId={boardId} />;
}
