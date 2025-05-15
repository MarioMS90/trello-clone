import { Suspense } from 'react';
import { BoardsSkeleton, SidebarSkeleton } from '@/components/ui/skeletons';
import { StarredBoards } from '@/components/dashboard/board/boards';
import { CreateWorkspace } from '@/components/dashboard/workspace/create-workspace';
import Workspaces from '@/components/dashboard/workspace/workspaces';
import { Sidebar } from '@/components/dashboard/sidebar/sidebar';

export default function WorkspacesPage() {
  return (
    <>
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="bg-main-background grow text-white">
        <div className="main-container">
          <div className="space-y-12">
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
          </div>
        </div>
      </main>
    </>
  );
}
