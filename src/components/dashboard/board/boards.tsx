import { TBoard } from '@/types/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkspace, getStarredBoards } from '@/lib/utils/server-utils';
import StarToggleBoard from '@/components/dashboard/board/star-toggle-board';
import StarIcon from '../../icons/star';
import { CreateBoard } from './create-board';

export async function Boards({ workspaceId }: { workspaceId: string }) {
  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <BoardList
      boards={workspace.boards}
      extraItem={
        <CreateBoard
          popoverClassName="[&]:center-y [&]:left-[calc(100%+10px)]"
          workspaceId={workspaceId}
        />
      }
    />
  );
}

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

            <StarToggleBoard className="bottom-3 top-[unset] transform-none" board={board} />
          </li>
        ))}
      {extraItem && <li>{extraItem}</li>}
    </ul>
  );
}

export async function StarredBoards() {
  const starredBoards = await getStarredBoards();

  if (!starredBoards.length) {
    return null;
  }

  return (
    <section>
      <div className="flex items-center gap-3 font-bold">
        <StarIcon height={20} />
        <h2>Starred boards </h2>
      </div>

      <BoardList boards={starredBoards} />
    </section>
  );
}
