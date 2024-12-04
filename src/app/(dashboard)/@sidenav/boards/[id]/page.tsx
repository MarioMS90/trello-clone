import { WorkspaceSidebar } from '@/components/dashboard/sidebar/sidebar';
import { SidebarSkeleton } from '@/components/ui/skeletons';
import { Suspense } from 'react';

export default async function BoardSidenavPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = await params;

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <WorkspaceSidebar boardId={boardId} />
    </Suspense>
  );
}
