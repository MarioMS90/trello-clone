import StarIcon from '@/components/icons/star';
import { MarkedBoards } from '@/components/dashboard/boards';
import { CreateWorkspaceButton } from '@/components/dashboard/buttons';
import { Workspaces } from '@/components/dashboard/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/ui/skeletons';

export default function WorkspacesPage() {
  return (
    <>
      <div className="mb-16 space-y-12">
        <section>
          <div className="flex items-center gap-3 font-bold">
            <StarIcon height="20px" />
            <h2>Marked boards </h2>
          </div>
          <Suspense fallback={<BoardsSkeleton />}>
            <MarkedBoards />
          </Suspense>
        </section>
        <section>
          <h2 className="font-bold">Your workspaces</h2>
          <Suspense fallback={<BoardsSkeleton />}>
            <Workspaces />
          </Suspense>
        </section>
      </div>
      <CreateWorkspaceButton />
    </>
  );
}
