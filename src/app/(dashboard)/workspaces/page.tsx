import { CreateWorkspacePopover } from '@/components/dashboard/popovers';
import { Workspaces } from '@/components/dashboard/workspaces/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { StarredBoards } from '@/components/dashboard/boards';

export default function WorkspacesPage() {
  return (
    <div className="main-container">
      <div className="mb-16 space-y-12">
        <Suspense fallback={<BoardsSkeleton />}>
          <StarredBoards />
        </Suspense>

        <section>
          <h2 className="font-bold">Your workspaces</h2>
          <Suspense fallback={<BoardsSkeleton />}>
            <Workspaces />
          </Suspense>
        </section>
      </div>
      <CreateWorkspacePopover />
    </div>
  );
}
