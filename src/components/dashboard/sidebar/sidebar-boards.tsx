'use client';

import Link from 'next/link';
import { TBoard, TSubsetWithId } from '@/types/types';
import { useState } from 'react';
import { deleteEntityAction, updateEntityAction } from '@/lib/actions';
import { useOptimisticList } from '@/hooks/useOptimisticList';
import { cn } from '@/lib/utils/utils';
import EditableText from '@/components/ui/editable-text';
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
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [selectedPopover, setSelectedPopover] = useState<string | null>(null);
  const {
    optimisticList: optimisticBoards,
    optimisticUpdate,
    optimisticDelete,
  } = useOptimisticList(boards);

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
      {optimisticBoards.map(board => (
        <li
          className={cn(
            'group relative [&:hover:not(:has(.popover:hover))]:bg-button-hovered-background',
            {
              'bg-button-hovered-background': currentBoardId === board.id,
            },
          )}
          key={board.id}>
          <EditableText
            className="[&>input:focus]:shadow-none [&>input]:my-0.5 [&>input]:ml-4 [&>input]:mr-[74px] [&>input]:w-full [&>input]:rounded-lg [&>input]:font-semibold [&>input]:text-primary"
            defaultText={board.name}
            onEdit={name => handleUpdate({ id: board.id, name })}
            editing={editingBoardId === board.id}
            onEditingChange={isEditing => {
              if (isEditing) {
                setEditingBoardId(board.id);
              } else {
                setEditingBoardId(null);
              }
            }}>
            <Link
              className="block overflow-hidden text-ellipsis py-0.5 pl-1.5 pr-[70px] text-white"
              href={`/boards/${board.id}`}>
              {board.name}
            </Link>
          </EditableText>
          <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover]:block">
            <Popover
              triggerContent={<DotsIcon height={16} />}
              triggerClassName="[&]:p-1"
              popoverClassName="px-0 [&]:w-40"
              open={selectedPopover === board.id}
              onOpenChange={isOpen => {
                if (isOpen) {
                  setSelectedPopover(board.id);
                } else {
                  setSelectedPopover(null);
                }
              }}>
              <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBoardId(board.id);
                      setSelectedPopover(null);
                    }}>
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
            className={cn('hidden group-[:hover:not(:has(.popover:hover))]:block', {
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
