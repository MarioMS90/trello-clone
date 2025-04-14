'use client';

import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils/utils';
import EditableText from '@/components/ui/editable-text';
import { useBoardId } from '@/hooks/useBoardId';
import { useBoardsByWorkspaceId, useStarredBoard } from '@/lib/board/queries';
import useOptimisticMutation from '@/hooks/useOptimisticMutation';
import { useMutation } from '@tanstack/react-query';
import { deleteBoard, updateBoard } from '@/lib/board/actions';
import { StarToggleBoard } from '../board/star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export default function SidebarBoards({ workspaceId }: { workspaceId: string }) {
  const { data: initialBoards } = useBoardsByWorkspaceId(workspaceId);
  const currentBoardId = useBoardId();
  const { data: isStarred } = useStarredBoard(currentBoardId);
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [selectedPopover, setSelectedPopover] = useState<string | null>(null);

  const [{ mutate: updateBoardAction }, boards] = useOptimisticMutation({
    state: initialBoards,
    optimisticUpdater: (current, variables) =>
      current.map(board =>
        board.id === variables.id ? { ...board, name: variables.name } : board,
      ),
    options: {
      mutationFn: async (data: { id: string; name: string }) => {
        updateBoard(data);
      },
      onError: () => {
        alert('An error occurred while updating the element');
      },
    },
  });

  const { mutate: removeBoardAction } = useMutation({
    mutationFn: async (boardId: string) => {
      let redirectUrl: string | undefined;
      if (boardId === currentBoardId) {
        redirectUrl = `/workspaces/${workspaceId}`;
      }

      deleteBoard(boardId, redirectUrl);
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  return (
    <ul>
      {boards.map(({ id, name }) => (
        <li
          className={cn(
            'group relative [&:hover:not(:has(.popover:hover))]:bg-button-hovered-background',
            {
              'bg-button-hovered-background': currentBoardId === id,
            },
          )}
          key={id}>
          <EditableText
            className="[&>input:focus]:shadow-none [&>input]:my-0.5 [&>input]:ml-4 [&>input]:mr-[74px] [&>input]:w-full [&>input]:rounded-lg [&>input]:font-semibold [&>input]:text-primary"
            defaultText={name}
            onEdit={text => updateBoardAction({ id, name: text })}
            editing={editingBoardId === id}
            onEditingChange={isEditing => {
              if (isEditing) {
                setEditingBoardId(id);
              } else {
                setEditingBoardId(null);
              }
            }}>
            <Link
              className="block overflow-hidden text-ellipsis py-0.5 pl-1.5 pr-[70px] text-white"
              href={`/boards/${id}`}>
              {name}
            </Link>
          </EditableText>
          <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover]:block">
            <Popover
              triggerContent={<DotsIcon height={16} />}
              triggerClassName="[&]:p-1"
              popoverClassName="px-0 [&]:w-40"
              open={selectedPopover === id}
              onOpenChange={isOpen => {
                if (isOpen) {
                  setSelectedPopover(id);
                } else {
                  setSelectedPopover(null);
                }
              }}>
              <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBoardId(id);
                      setSelectedPopover(null);
                    }}>
                    Rename board
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => removeBoardAction(id)}>
                    Delete board
                  </button>
                </li>
              </ul>
            </Popover>
          </div>

          <StarToggleBoard
            className={cn('z-10 hidden group-[:hover:not(:has(.popover:hover))]:block', {
              '[&]:block': isStarred,
            })}
            boardId={id}
          />
        </li>
      ))}
    </ul>
  );
}
