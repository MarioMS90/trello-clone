'use client';

import { TBoard } from '@/types/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { StarToggleBoard } from '@/components/dashboard/board/star-toggle-board';
import { useBoardsByWorkspaceId, useStarredBoards } from '@/lib/board/queries';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useWorkspace } from '@/lib/workspace/queries';
import StarIcon from '../../icons/star';
import { CreateBoard } from './create-board';

export function BoardList({
  className,
  boards,
  extraItem,
}: {
  className?: string;
  boards: TBoard[];
  extraItem?: React.ReactNode;
}) {
  return (
    <ul className={`mt-4 flex flex-wrap gap-4 ${className}`}>
      {boards &&
        boards.map(board => (
          <li
            className="
              relative 
              h-20 
              w-44 
              rounded 
              bg-white
              text-primary 
              hover:bg-opacity-95
            "
            key={board.id}>
            <Link
              className="block h-full w-full pl-4 pt-2 text-sm font-bold"
              href={`/boards/${board.id}`}>
              {board.name}
            </Link>

            <StarToggleBoard className="bottom-3 top-[unset] transform-none" boardId={board.id} />
          </li>
        ))}
      {extraItem && <li>{extraItem}</li>}
    </ul>
  );
}

export function Boards() {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: boards } = useBoardsByWorkspaceId(workspaceId);

  if (!workspace) {
    redirect('/workspaces');
  }

  return (
    <BoardList
      boards={boards}
      extraItem={
        <CreateBoard
          popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
          workspaceId={workspace.id}
        />
      }
    />
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

      <BoardList boards={starredBoards} />
    </section>
  );
}
