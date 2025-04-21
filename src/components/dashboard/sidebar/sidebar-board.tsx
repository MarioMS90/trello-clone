'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import EditableText from '@/components/ui/editable-text';
import { useBoardId } from '@/hooks/useBoardId';
import { boardKeys, useStarredBoardId } from '@/lib/board/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBoard, updateBoard } from '@/lib/board/actions';
import { TBoard } from '@/types/db';
import invariant from 'tiny-invariant';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useRouter } from 'next/navigation';
import { StarToggleBoard } from '../board/star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export const SidebarBoard = memo(function SidebarBoard({ board }: { board: TBoard }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentBoardId = useBoardId();
  const workspaceId = useWorkspaceId();
  const { data: isStarred } = useStarredBoardId(board.id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { queryKey } = boardKeys.list();

  const { mutate: removeBoard } = useMutation({
    mutationFn: async (id: string) => deleteBoard(id),
    onSuccess: async ({ data }) => {
      invariant(data);

      if (data.id === currentBoardId) {
        router.push(`/workspaces/${workspaceId}`);
      }

      return queryClient.setQueryData(queryKey, (old: TBoard[]) =>
        old.filter(_board => _board.id !== data.id),
      );
    },
    onError: () => {
      alert('An error occurred while deleting the element');
    },
  });

  const updateBoardName = useMutation({
    mutationFn: async (variables: { id: string; name: string }) => updateBoard(variables),

    onSuccess: async ({ data }) => {
      invariant(data);
      return queryClient.setQueryData(queryKey, (old: TBoard[]) =>
        old.map(_board => (_board.id === data.id ? data : _board)),
      );
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const name = updateBoardName.isPending ? updateBoardName.variables.name : board.name;

  return (
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
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}>
        <Link
          className="block overflow-hidden text-ellipsis py-0.5 pl-1.5 pr-[70px] text-white"
          href={`/boards/${board.id}`}>
          {name}
        </Link>
      </EditableText>
      <div className="center-y absolute right-11 z-10 hidden group-hover:block has-[.popover]:block">
        <Popover
          triggerContent={<DotsIcon height={16} />}
          triggerClassName="[&]:p-1"
          popoverClassName="px-0 [&]:w-40"
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}>
          <ul className="text-sm [&>li>button:hover]:bg-gray-200 [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left">
            <li>
              <button
                type="button"
                onClick={() => {
                  setIsEditingName(true);
                  setIsPopoverOpen(false);
                }}>
                Rename board
              </button>
            </li>
            <li>
              <button type="button" onClick={() => removeBoard(board.id)}>
                Delete board
              </button>
            </li>
          </ul>
        </Popover>
      </div>

      <StarToggleBoard
        className={cn('z-[5] hidden group-[:hover:not(:has(.popover:hover))]:block', {
          '[&]:block': isStarred,
        })}
        boardId={board.id}
      />
    </li>
  );
});
