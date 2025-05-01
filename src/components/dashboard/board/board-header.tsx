'use client';

import { useBoard } from '@/lib/board/queries';
import { useBoardId } from '@/hooks/useBoardId';
import EditableText from '@/components/ui/editable-text';
import { useBoardMutations } from '@/hooks/useBoardMutation';
import { useState } from 'react';
import Link from 'next/link';

export default function BoardHeader() {
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateBoardName, removeBoard } = useBoardMutations();

  const name = updateBoardName.isPending ? updateBoardName.variables.name : board.name;

  if (!board) {
    return null;
  }

  return (
    <div className="bold flex bg-secondary-background p-3.5 ">
      <EditableText
        className="[&>input:focus]:shadow-none [&>input]:my-0.5 [&>input]:ml-4 [&>input]:mr-[74px] [&>input]:w-full [&>input]:rounded-lg [&>input]:font-semibold [&>input]:text-primary [&>span]:p-0"
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}
        editOnClick>
        <Link
          className="block overflow-hidden text-ellipsis py-2 pl-3.5 pr-[70px] text-white"
          href={`/boards/${board.id}`}>
          {name}
        </Link>
      </EditableText>
    </div>
  );
}
