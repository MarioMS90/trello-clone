import StarIcon from '@/components/icons/star';
import { StarredBoards } from '@/components/dashboard/boards';
import { CreateWorkspacePopover } from '@/components/dashboard/popovers';
import { Workspaces } from '@/components/dashboard/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/ui/skeletons';

export default function WorkspacesPage() {
  return (
    <div className="main-container">
      <div className="mb-16 space-y-12">
        <section>
          <div className="flex items-center gap-3 font-bold">
            <StarIcon height="20px" />
            <h2>Starred boards </h2>
          </div>
          <Suspense fallback={<BoardsSkeleton />}>
            <StarredBoards />
          </Suspense>
        </section>
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
