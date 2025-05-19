'use client';

import Link from 'next/link';
import { memo, useState } from 'react';
import { cn } from '@/lib/utils/utils';
import EditableText from '@/components/ui/editable-text';
import { useStarredBoardId } from '@/lib/board/queries';
import { TBoard } from '@/types/db';
import { useBoardMutation } from '@/hooks/useBoardMutation';
import { useBoardId } from '@/hooks/useBoardId';
import { StarToggleBoard } from '../board/star-toggle-board';
import DotsIcon from '../../icons/dots';
import Popover from '../../ui/popover';

export const SidebarBoard = memo(function SidebarBoard({ board }: { board: TBoard }) {
  const currentBoardId = useBoardId();
  const { data: isStarred } = useStarredBoardId(board.id);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateBoardName, removeBoard } = useBoardMutation();

  const name = updateBoardName.isPending ? updateBoardName.variables.name : board.name;

  return (
    <li
      className={cn(
        'group [&:hover:not(:has(.popover:hover))]:bg-button-hovered-background relative',
        {
          'bg-button-hovered-background': currentBoardId === board.id,
        },
      )}
      key={board.id}>
      <EditableText
        className="[&>input]:my-0.5 [&>input]:mr-[74px] [&>input]:ml-1.5 [&>input]:w-full [&>input:focus]:shadow-none [&>span]:p-0"
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}>
        <Link
          className="w-full overflow-hidden py-2 pr-[70px] pl-3.5 text-ellipsis text-white"
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
          <ul className="text-sm [&>li>button]:w-full [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-left [&>li>button:hover]:bg-gray-200">
            <li>
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => {
                  setIsEditingName(true);
                  setIsPopoverOpen(false);
                }}>
                Rename board
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer"
                type="button"
                onClick={() => removeBoard.mutate(board.id)}>
                Delete board
              </button>
            </li>
          </ul>
        </Popover>
      </div>

      <StarToggleBoard
        className={cn(
          'center-y absolute right-3 z-5  hidden group-[:hover:not(:has(.popover:hover))]:block',
          {
            '[&]:block': isStarred,
          },
        )}
        board={board}
      />
    </li>
  );
});
