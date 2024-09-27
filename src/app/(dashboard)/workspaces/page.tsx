import StarIcon from '@/components/icons/star';
import { MarkedBoards } from '@/components/dashboard/boards';
import { ButtonCreateWorkspace } from '@/components/dashboard/buttons';
import { WorkspacesList } from '@/components/dashboard/workspaces';
import { Suspense } from 'react';
import { fetchUserWorkspaces } from '@/lib/data';

export default function WorkspacesPage() {
  return (
    <div className="p-4 text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="mb-16 hidden space-y-12 has-[.board]:block">
          <section>
            <div className="flex items-center gap-3 font-bold">
              <StarIcon height="20px" />
              <h2>Marked boards</h2>
            </div>
            <MarkedBoards />
          </section>
          <section>
            <div className="flex items-center gap-3 font-bold">
              <h2>Your workspaces</h2>
            </div>
            <Workspaces />
          </section>
        </div>
      </Suspense>
      <ButtonCreateWorkspace />
    </div>
  );
}

async function Workspaces() {
  const workspaces = await fetchUserWorkspaces();

  return <WorkspacesList workspaces={workspaces} />;
}
