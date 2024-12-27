'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Board } from '@/types/app-types';
import { useEffect, useRef, useState } from 'react';
import { deleteBoardAction, renameBoardAction } from '@/lib/actions';
import { StarToggle } from '../star-toggle';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export function SidebarBoards({ boardList, boardId }: { boardList: Board[]; boardId?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [boards, setBoards] = useState(boardList);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [editedBoard, setEditedBoard] = useState<{ id: string; name: string; isEditing: boolean }>({
    id: '',
    name: '',
    isEditing: false,
  });

  useEffect(() => {
    if (editedBoard.isEditing && inputRef.current) {
      inputRef.current.select();
      setSelectedButton(null);
    }
  }, [editedBoard.isEditing]);

  useEffect(() => {
    setBoards(boardList);
  }, [boardList]);

  const handleRenameBoard = async (id: string) => {
    setEditedBoard({ ...editedBoard, isEditing: false });
    await renameBoardAction(id, editedBoard.name);
  };

  const handleDeleteBoard = async (id: string) => {
    await deleteBoardAction(id);
  };

  return (
    <ul>
      {boards.map(({ id, name, starred }, boardIndex) => (
        <li className="group relative" key={id}>
          {editedBoard.id === id && editedBoard.isEditing ? (
            <div className="pl-4 pr-[70px]">
              <input
                type="text"
                className="w-full rounded-lg border-none p-2 font-semibold text-primary outline-offset-0 outline-secondary"
                style={{ height: '32px' }}
                value={editedBoard.name}
                ref={inputRef}
                onBlur={() => handleRenameBoard(id)}
                onChange={e => setEditedBoard({ ...editedBoard, name: e.target.value })}
              />
            </div>
          ) : (
            <>
              <Link
                className={clsx('block py-2 pl-4 pr-[70px] hover:bg-button-hovered-background', {
                  'bg-button-hovered-background': boardId === id,
                })}
                href={`/boards/${id}`}>
                {editedBoard.id === id ? editedBoard.name : name}
              </Link>

              <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover-wrapper>.popover]:block">
                <Popover
                  triggerContent={<DotsIcon height={16} />}
                  triggerClassName="[&]:p-1"
                  popoverClassName="px-0 [&]:w-40"
                  open={selectedButton === id}
                  onOpenChange={isOpen => isOpen && setSelectedButton(id)}>
                  <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setEditedBoard({ id, name, isEditing: true });
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
                onStarToggle={isStarred =>
                  setBoards(boards.with(boardIndex, { ...boards[boardIndex], starred: isStarred }))
                }
              />
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
