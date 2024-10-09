import StarIcon from '@/components/icons/star';
import { MarkedBoards } from '@/components/dashboard/boards';
import { ButtonCreateWorkspace } from '@/components/dashboard/buttons';
import { Workspaces } from '@/components/dashboard/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/dashboard/skeletons';
import { MainSideNav } from '@/components/dashboard/sidenavs';

export default function WorkspacesPage() {
  return (
    <>
      <MainSideNav />

      <main className="grow bg-main-background pl-8 pt-6 text-white">
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
            <div className="flex items-center gap-3 font-bold">
              <h2>Your workspaces</h2>
            </div>
            <Suspense fallback={<BoardsSkeleton />}>
              <Workspaces />
            </Suspense>
          </section>
        </div>
        <ButtonCreateWorkspace />
      </main>
    </>
  );
}
