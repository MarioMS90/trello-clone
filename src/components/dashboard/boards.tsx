'use client';

import { useWorkspacesStore } from '@/stores/workspaces-store';
import { Board, UserWorkspace } from '@/types/app-types';
import Link from 'next/link';
import { useEffect } from 'react';
import StarFillIcon from '../icons/star-fill';
import StarIcon from '../icons/star';

export function BoardList({
  className,
  selectedWorkspace,
  boards,
  extraItem,
}: {
  className?: string;
  selectedWorkspace?: UserWorkspace;
  boards?: Board[];
  extraItem?: React.ReactNode;
}) {
  const { setSelectedWorkspace } = useWorkspacesStore();

  useEffect(() => {
    if (!selectedWorkspace) {
      return;
    }

    setSelectedWorkspace(selectedWorkspace);
  }, [selectedWorkspace, setSelectedWorkspace]);

  return (
    <ul className={`mt-4 flex flex-wrap gap-4 ${className}`}>
      {boards &&
        boards.map(({ id, name, marked }) => (
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
  const { workspaces } = useWorkspacesStore();

  const getMarkedBoards = () =>
    workspaces.flatMap(workspace => workspace.boards.filter(board => board.marked));

  return <BoardList boards={getMarkedBoards()} />;
}
