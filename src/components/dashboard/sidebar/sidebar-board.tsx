'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import EditableText from '@/components/ui/editable-text';
import { useBoardId } from '@/hooks/useBoardId';
import { useStarredBoardId } from '@/lib/board/queries';
import { TBoard } from '@/types/db';
import { useBoardMutations } from '@/hooks/useBoardMutation';
import { StarToggleBoard } from '../board/star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export const SidebarBoard = memo(function SidebarBoard({ board }: { board: TBoard }) {
  const currentBoardId = useBoardId();
  const { data: isStarred } = useStarredBoardId(board.id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateBoardName, removeBoard } = useBoardMutations();

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
        className="[&>input:focus]:shadow-none [&>input]:my-0.5 [&>input]:ml-4 [&>input]:mr-[74px] [&>input]:w-full [&>input]:rounded-lg [&>input]:font-semibold [&>input]:text-primary [&>span]:p-0"
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}>
        <Link
          className="block overflow-hidden text-ellipsis py-2 pl-3.5 pr-[70px] text-white"
          href={`/boards/${board.id}`}>
          {name}
        </Link>
      </EditableText>
      <div
        className={cn('center-y absolute right-11 z-10 hidden group-hover:block', {
          block: isPopoverOpen,
        })}>
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
              <button type="button" onClick={() => removeBoard.mutate(board.id)}>
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
