'use client';

import { useBoard } from '@/lib/board/queries';
import EditableText from '@/components/ui/editable-text';
import { useBoardMutation } from '@/hooks/useBoardMutation';
import { useState } from 'react';
import Popover from '@/components/ui/popover';
import DotsIcon from '@/components/icons/dots';
import Avatar from '@/components/ui/avatar';
import { useMembers } from '@/lib/user/queries';
import { useWorkspaceId } from '@/hooks/useWorkspaceId';
import { useBoardId } from '@/hooks/useBoardId';
import { StarToggleBoard } from './star-toggle-board';

export default function BoardHeader() {
  const workspaceId = useWorkspaceId();
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);
  const members = useMembers(workspaceId);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateBoardName, removeBoard } = useBoardMutation();

  if (!board) {
    return null;
  }

  const boardName = updateBoardName.isPending ? updateBoardName.variables.name : board.name;

  return (
    <div className="bg-secondary-background flex items-center justify-between p-2.5 font-medium">
      <div className="flex items-center gap-4">
        <EditableText
          className="inline-block grow-0 [&>button]:p-0 [&>input]:m-0 [&>input]:w-auto [&>input]:rounded-sm [&>input]:px-3 [&>input]:py-1 [&>input]:text-lg [&>input]:font-bold [&>input:focus]:shadow-none"
          defaultText={boardName}
          onEdit={text => {
            updateBoardName.mutate({ id: board.id, name: text });
          }}
          editing={isEditingName}
          onEditingChange={setIsEditingName}
          editOnClick>
          <h2 className="hover:bg-button-hovered-background inline-block overflow-hidden rounded-sm px-3 py-1 text-lg font-bold text-white">
            {boardName}
          </h2>
        </EditableText>
        <StarToggleBoard
          className="hover:bg-button-hovered-background rounded p-2 hover:scale-none"
          board={board}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {members.map(member => (
            <Avatar
              key={member.id}
              className="size-7 cursor-default"
              user={member}
              title={`${member.name} (${member.role})`}
            />
          ))}
        </div>
        <Popover
          triggerContent={<DotsIcon height={20} />}
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
    </div>
  );
}
