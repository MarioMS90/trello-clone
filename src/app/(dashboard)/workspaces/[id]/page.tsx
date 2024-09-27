import { BoardList } from '@/components/dashboard/boards';
import { ButtonCreateBoard } from '@/components/dashboard/buttons';
import { fetchWorkspaceWithTasks } from '@/lib/data';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Workspaces',
};

export default function BoardsPage({ params: { id: workspaceId } }: { params: { id: string } }) {
  return (
    <div className="p-4 text-white">
      <h1>Boards</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Boards workspaceId={workspaceId} />
      </Suspense>
    </div>
  );
}

async function Boards({ workspaceId }: { workspaceId: string }) {
  const selectedWorkspace = await fetchWorkspaceWithTasks(workspaceId);

  return (
    <BoardList
      className="mt-6"
      selectedWorkspace={selectedWorkspace}
      extraItem={<ButtonCreateBoard />}
    />
  );
  // return <pre>{JSON.stringify(workspace, null, 2)}</pre>;
}
