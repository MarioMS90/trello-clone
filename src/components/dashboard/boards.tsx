'use client';

import { useWorkspacesStore } from '@/providers/workspaces-store-provider';
import { Board } from '@/types/app-types';
import Link from 'next/link';
import StarFillIcon from '../icons/star-fill';
import StarIcon from '../icons/star';

export function Boards({
  className,
  boards,
  extraItem,
}: {
  className?: string;
  boards: Board[];
  extraItem?: React.ReactNode;
}) {
  return (
    <ul className={`mt-4 flex flex-wrap gap-4 ${className}`}>
      {boards.map(({ id, name, marked }) => (
        <li className="board" key={id}>
          <Link href={`/boards/${id}`}>
            <div
              className={`
                relative 
                h-20 
                w-44 
                rounded 
                bg-white 
                pl-4 
                pt-2 
                text-sm 
                font-bold 
                text-primary 
                hover:opacity-90
              `}>
              {name}
              {marked ? (
                <StarFillIcon
                  className="absolute bottom-2 right-3 z-10 text-yellow-400 hover:scale-125"
                  height="16px"
                />
              ) : (
                <StarIcon
                  className="absolute bottom-2 right-3 z-10 hover:scale-125"
                  height="16px"
                />
              )}
            </div>
          </Link>
        </li>
      ))}
      {extraItem && <li>{extraItem}</li>}
    </ul>
  );
}

export function MarkedBoards() {
  const { workspaces } = useWorkspacesStore(state => state);

  const getMarkedBoards = () =>
    workspaces.flatMap(workspace => workspace.boards.filter(board => board.marked));

  return <Boards boards={getMarkedBoards()} />;
}
