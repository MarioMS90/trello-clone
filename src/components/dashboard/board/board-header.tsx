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
    <div className="flex items-center justify-between bg-secondary-background p-3 font-medium">
      <EditableText
        className="inline-block grow-0 [&>button]:p-0 [&>input:focus]:shadow-none [&>input]:m-0 [&>input]:w-auto [&>input]:px-3 [&>input]:py-1 [&>input]:text-lg [&>input]:font-bold"
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}
        editOnClick>
        <h2 className="inline-block overflow-hidden rounded-sm px-3 py-1 text-lg font-bold text-white hover:bg-button-hovered-background">
          {name}
        </h2>
      </EditableText>
    </div>
  );
}
