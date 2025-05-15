'use client';

import { notFound } from 'next/navigation';
import { useBoards, useStarredBoards } from '@/lib/board/queries';
import { useWorkspace } from '@/lib/workspace/queries';
import { useSharedStore } from '@/stores/shared-store';
import { useEffect } from 'react';
import StarIcon from '../../icons/star';
import { CreateBoard } from './create-board';
import { BoardPreview } from './board-preview';

export function Boards({ workspaceId }: { workspaceId: string }) {
  const { setWorkspaceId } = useSharedStore(state => state);
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: boards } = useBoards(workspaceId);

  if (!workspace) {
    notFound();
  }

  useEffect(() => {
    setWorkspaceId(workspaceId);
  }, [setWorkspaceId, workspaceId]);

  return (
    <ul className="mt-4 flex flex-wrap gap-4">
      {boards.map(board => (
        <BoardPreview board={board} key={board.id} />
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
          <BoardPreview board={board} key={board.id} />
        ))}
      </ul>
    </section>
  );
}
