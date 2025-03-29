import { Workspaces } from '@/components/dashboard/workspace/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { StarredBoards } from '@/components/dashboard/board/boards';
import { CreateWorkspace } from '@/components/dashboard/workspace/create-workspace';

export default function WorkspacesPage() {
  return (
    <div className="main-container">
      {/* <div className="space-y-12">
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
      <div className="inline-block">
        <CreateWorkspace />
      </div> */}
    </div>
  );
}
