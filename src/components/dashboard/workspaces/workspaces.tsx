import { CreateBoardPopover } from '@/components/dashboard/popovers';
import { fetchWorkspaces } from '@/lib/data';
import { BoardList } from '@/components/dashboard/boards';
import { WorkspaceButtons } from './workspace-buttons';

export async function Workspaces() {
  const workspaces = await fetchWorkspaces();

  return (
    <ul className={`mt-6 space-y-12 ${workspaces.length ? 'mb-16' : ''}`}>
      {workspaces.map(({ id, name, boards }) => (
        <li key={id}>
          <WorkspaceButtons workspaceId={id} workspaceName={name} />

          <BoardList
            className="mt-6"
            boards={boards}
            extraItem={<CreateBoardPopover workspaceId={id} />}
          />
        </li>
      ))}
    </ul>
  );
}
