'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Board } from '@/types/app-types';
import { useEffect, useRef, useState } from 'react';
import { StarToggle } from './star-toggle';
import DotsIcon from '../icons/dots';
import Popover from '../ui/popover';

export function BoardLinks({
  boards,
  selectedBoardId,
}: {
  boards: Board[];
  selectedBoardId?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editedBoardId, setEditedBoardId] = useState<string | null>(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  useEffect(() => {
    if (editingBoardId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingBoardId]);

  return (
    <ul>
      {boards.map(({ id, name, starred }) => (
        <li className="group relative" key={id}>
          {editingBoardId === id ? (
            <div className="px-4">
              <input
                type="text"
                className="rounded-lg p-2 font-semibold text-primary outline-secondary"
                style={{ height: '32px' }}
                value={newBoardName}
                ref={inputRef}
                onBlur={() => {
                  setEditedBoardId(id);
                  setEditingBoardId(null);
                  console.log('Save new board name:', newBoardName);
                  // modify name
                }}
                onChange={e => setNewBoardName(e.target.value)}
              />
            </div>
          ) : (
            <>
              <Link
                className={clsx('block px-4 py-2 hover:bg-button-hovered-background', {
                  'bg-button-hovered-background': selectedBoardId === id,
                })}
                href={`/boards/${id}`}>
                {editedBoardId === id ? newBoardName : name}
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
                          setEditingBoardId(id);
                          setNewBoardName(name);
                        }}>
                        Rename board
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={async () => {
                          ('');
                        }}>
                        Delete board
                      </button>
                    </li>
                  </ul>
                </Popover>
              </div>

              {/* The key prop is used to force the client component to re-render when the starred prop changes in another place */}
              <StarToggle
                className={clsx('hidden group-hover:block', {
                  '[&]:block': starred,
                })}
                key={String(starred)}
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
