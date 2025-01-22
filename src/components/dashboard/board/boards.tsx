import { TBoard } from '@/types/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWorkspace, getStarredBoards } from '@/lib/utils/server-utils';
import StarToggleBoard from '@/components/dashboard/board/star-toggle-board';
import StarIcon from '../../icons/star';
import { CreateBoardPopover } from './create-board';

export async function Boards({ workspaceId }: { workspaceId: string }) {
  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    notFound();
  }

  return (
    <BoardList
      boards={workspace.boards}
      extraItem={<CreateBoardPopover workspaceId={workspaceId} />}
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
        boards.map(({ id, name, starred }) => (
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
            key={id}>
            <Link
              className="block h-full w-full pl-4 pt-2 text-sm font-bold"
              href={`/boards/${id}`}>
              {name}
            </Link>

            <StarToggleBoard
              className="bottom-3 top-[unset] transform-none"
              board={{ id, name, starred } as TBoard}
              starred={starred}
            />
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
