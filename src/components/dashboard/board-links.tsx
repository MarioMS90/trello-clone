'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Board } from '@/types/app-types';
import { useEffect, useRef, useState } from 'react';
import { deleteBoardAction, renameBoardAction } from '@/lib/actions';
import { StarToggle } from './star-toggle';
import DotsIcon from '../icons/dots';
import Popover from '../ui/popover';

export function BoardLinks({
  boardList,
  selectedBoardId,
}: {
  boardList: Board[];
  selectedBoardId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [boards, setBoards] = useState<(Board & { editing?: boolean })[]>(boardList);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const isEditing = boards.some(board => board.editing);

  useEffect(() => {
    setBoards(boardList);
  }, [boardList]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRenameBoard = async (boardId: string, boardIndex: number) => {
    setBoards(boards.with(boardIndex, { ...boards[boardIndex], editing: false }));
    await renameBoardAction(boardId, boards[boardIndex].name);
  };

  const handleDeleteBoard = async (boardId: string) => {
    await deleteBoardAction(boardId);
  };

  return (
    <ul>
      {boards.map(({ id, name, starred, editing }, index) => (
        <li className="group relative" key={id}>
          {editing ? (
            <div className="pl-4 pr-[70px]">
              <input
                type="text"
                className="w-full rounded-lg border-none p-2 font-semibold text-primary outline-offset-0 outline-secondary"
                style={{ height: '32px' }}
                value={name}
                ref={inputRef}
                onBlur={() => handleRenameBoard(id, index)}
                onChange={e =>
                  setBoards(boards.with(index, { ...boards[index], name: e.target.value }))
                }
              />
            </div>
          ) : (
            <>
              <Link
                className={clsx('block py-2 pl-4 pr-[70px] hover:bg-button-hovered-background', {
                  'bg-button-hovered-background': selectedBoardId === id,
                })}
                href={`/boards/${id}`}>
                {name}
              </Link>

              <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover-wrapper>.popover]:block">
                <Popover
                  triggerContent={<DotsIcon height={16} />}
                  triggerClassName="[&]:p-1"
                  popoverClassName="px-0"
                  open={selectedButton === id}
                  onOpenChange={isOpen => isOpen && setSelectedButton(id)}>
                  <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setBoards(boards.with(index, { ...boards[index], editing: true }));
                        }}>
                        Rename board
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => handleDeleteBoard(id)}>
                        Delete board
                      </button>
                    </li>
                  </ul>
                </Popover>
              </div>

              <StarToggle
                className={clsx('hidden group-hover:block', {
                  '[&]:block': starred,
                })}
                boardId={id}
                starred={starred}
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
