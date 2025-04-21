'use client';

import { redirect } from 'next/navigation';
import { useBoardsByWorkspaceId, useStarredBoards } from '@/lib/board/queries';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useWorkspace } from '@/lib/workspace/queries';
import StarIcon from '../../icons/star';
import { CreateBoard } from './create-board';
import { BoardPreview } from './board-preview';

export function Boards() {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: boards } = useBoardsByWorkspaceId(workspaceId);

  if (!workspace) {
    redirect('/workspaces');
  }

  return (
    <ul className="mt-4 flex flex-wrap gap-4">
      {boards.map(board => (
        <BoardPreview key={board.id} board={board} />
      ))}
      <li>
        <CreateBoard
          popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
          workspaceId={workspace.id}
        />
      </li>
    </ul>
  );
}

export function StarredBoards() {
  const { data: starredBoards } = useStarredBoards();

  if (!starredBoards.length) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-3 font-bold">
        <StarIcon height={20} />
        <h2>Starred boards</h2>
      </div>

      <ul className="mt-4 flex flex-wrap gap-4">
        {starredBoards.map(board => (
          <BoardPreview key={board.id} board={board} />
        ))}
      </ul>
    </section>
  );
}
