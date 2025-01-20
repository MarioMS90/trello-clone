import { Workspaces } from '@/components/dashboard/workspaces/workspaces';
import { Suspense } from 'react';
import { BoardsSkeleton } from '@/components/ui/skeletons';
import { StarredBoards } from '@/components/dashboard/boards/boards';
import Popover from '@/components/ui/popover';
import { CreateWorkspace } from '@/components/dashboard/workspaces/create-workspace';

export default function WorkspacesPage() {
  return (
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
        <Popover
          popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
          triggerClassName="
                rounded 
                px-2 
                py-1.5 
                h-20 
                w-44 
                bg-gray-300 
                text-sm 
                text-primary 
                justify-center 
                hover:opacity-90 
                hover:bg-gray-300 
              "
          triggerContent="Create a new workspace"
          addCloseButton>
          <CreateWorkspace />
        </Popover>
      </div>
    </div>
  );
}
