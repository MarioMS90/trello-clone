'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Board } from '@/types/app-types';
import { useEffect, useRef, useState } from 'react';
import { deleteBoardAction, updateBoardAction } from '@/lib/actions';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { StarToggleBoard } from '../star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export function SidebarBoards({
  boards,
  currentBoardId,
}: {
  boards: Board[];
  currentBoardId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const {
    optimisticList: optimisticBoards,
    isPending,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticMutation(boards, {
    updateAction: updateBoardAction,
    deleteAction: deleteBoardAction,
  });

  useEffect(() => {
    if (editingBoardId && inputRef.current) {
      inputRef.current.select();
      setSelectedButton(null);
    }
  }, [editingBoardId]);

  return (
    <ul>
      {optimisticBoards.map(board => (
        <li className="group relative" key={board.id}>
          {editingBoardId === board.id && !isPending ? (
            <div className="pl-4 pr-[70px]">
              <input
                type="text"
                className="w-full rounded-lg border-none p-2 font-semibold text-primary outline-offset-0 outline-secondary"
                style={{ height: '32px' }}
                defaultValue={board.name}
                ref={inputRef}
                onBlur={e => {
                  const newName = e.target.value.trim();
                  if (newName && board.name !== newName) {
                    optimisticUpdate({ ...board, name: newName });
                  }
                  setEditingBoardId(null);
                }}
                onKeyUp={e => e.key === 'Enter' && e.currentTarget.blur()}
              />
            </div>
          ) : (
            <>
              <Link
                className={clsx('block py-2 pl-4 pr-[70px] hover:bg-button-hovered-background', {
                  'bg-button-hovered-background': currentBoardId === board.id,
                })}
                href={`/boards/${board.id}`}>
                {board.name}
              </Link>

              <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover-wrapper>.popover]:block">
                <Popover
                  triggerContent={<DotsIcon height={16} />}
                  triggerClassName="[&]:p-1"
                  popoverClassName="px-0 [&]:w-40"
                  open={selectedButton === board.id}
                  onOpenChange={isOpen => isOpen && setSelectedButton(board.id)}>
                  <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                    <li>
                      <button type="button" onClick={() => setEditingBoardId(board.id)}>
                        Rename board
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => optimisticDelete(board)}>
                        Delete board
                      </button>
                    </li>
                  </ul>
                </Popover>
              </div>

              <StarToggleBoard
                className={clsx('hidden group-hover:block', {
                  '[&]:block': board.starred,
                })}
                starred={board.starred}
                onStarToggle={() => optimisticUpdate({ id: board.id, starred: !board.starred })}
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
