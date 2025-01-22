'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { TBoard, TSubsetWithId } from '@/types/types';
import { useEffect, useRef, useState } from 'react';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import { useOptimisticList } from '@/hooks/useOptimisticList';
import StarToggleBoard from '../board/star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export default function SidebarBoards({
  boards,
  currentWorkspaceId,
  currentBoardId,
}: {
  boards: TBoard[];
  currentWorkspaceId: string;
  currentBoardId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const {
    optimisticList: optimisticBoards,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticList(boards);

  useEffect(() => {
    if (editingBoardId && inputRef.current) {
      inputRef.current.select();
    }
  }, [editingBoardId]);

  const handleUpdate = (boardData: TSubsetWithId<TBoard>) => {
    optimisticUpdate(boardData, () =>
      updateEntityAction({ tableName: 'board', entityData: boardData }),
    );
  };

  const handleDelete = (boardData: TSubsetWithId<TBoard>) => {
    let redirectUrl: string | undefined;
    if (currentBoardId === boardData.id) {
      redirectUrl = `/workspaces/${currentWorkspaceId}`;
    }

    optimisticDelete(boardData, () =>
      deleteEntityAction({
        tableName: 'board',
        entityId: boardData.id,
        redirectUrl,
      }),
    );
  };

  return (
    <ul>
      {optimisticBoards.map((board, index) => (
        <li
          className={clsx(
            'group relative [&:hover:not(:has(.popover:hover))]:bg-button-hovered-background',
            {
              'bg-button-hovered-background': currentBoardId === board.id,
            },
          )}
          key={board.id}>
          {editingBoardId === board.id || index === 5 ? (
            <div className="py-0.5 pl-4 pr-[74px]">
              <input
                type="text"
                className="w-full rounded-lg border-none p-1.5 font-semibold text-primary outline-offset-0 outline-secondary"
                defaultValue={board.name}
                ref={inputRef}
                onBlur={e => {
                  const newName = e.target.value.trim();
                  if (newName && board.name !== newName) {
                    handleUpdate({ id: board.id, name: newName });
                  }
                  setEditingBoardId(null);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                onKeyUp={e => {
                  if (e.key === 'Escape') {
                    setEditingBoardId(null);
                  }
                }}
              />
            </div>
          ) : (
            <Link
              className={clsx('block overflow-hidden text-ellipsis py-2 pl-4 pr-[70px] ')}
              href={`/boards/${board.id}`}>
              {board.name}
            </Link>
          )}
          <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover]:block">
            <Popover
              triggerContent={<DotsIcon height={16} />}
              triggerClassName="[&]:p-1"
              popoverClassName="px-0 [&]:w-40">
              <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                <li>
                  <button type="button" onClick={() => setEditingBoardId(board.id)}>
                    Rename board
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleDelete(board)}>
                    Delete board
                  </button>
                </li>
              </ul>
            </Popover>
          </div>

          <StarToggleBoard
            className={clsx('hidden group-[:hover:not(:has(.popover:hover))]:block', {
              '[&]:block': board.starred,
            })}
            starred={board.starred}
            onStarToggle={() => handleUpdate({ id: board.id, starred: !board.starred })}
          />
        </li>
      ))}
    </ul>
  );
}

// updateAction: entityData =>
//   updateEntityAction({ tableName: 'board', entityData, revalidate: true }),
// deleteAction: entityId =>
//   deleteEntityAction({ tableName: 'board', entityId, revalidate: true }),
