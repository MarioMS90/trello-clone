import { Suspense } from 'react';
import { BoardsSkeleton } from '@/modules/common/components/ui/skeletons';
import { StarredBoards } from '@/modules/board/components/boards';
import { CreateWorkspace } from '@/modules/workspace/components/create-workspace';
import Workspaces from '@/modules/workspace/components/workspaces';
import { Metadata } from 'next';
import { Sidebar } from '@/modules/sidebar/components/sidebar';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default function WorkspacesPage() {
  return (
    <>
      <Sidebar />
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
