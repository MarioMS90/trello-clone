'use client';

import { useBoard } from '@/lib/board/queries';
import { useBoardId } from '@/hooks/useBoardId';
import EditableText from '@/components/ui/editable-text';
import { useBoardMutations } from '@/hooks/useBoardMutation';
import { useState } from 'react';
import { StarToggleBoard } from './star-toggle-board';

export default function BoardHeader() {
  const boardId = useBoardId();
  const { data: board } = useBoard(boardId);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { updateBoardName, removeBoard } = useBoardMutations();

  const name = updateBoardName.isPending ? updateBoardName.variables.name : board.name;

  return (
    <div className="bg-secondary-background flex items-center justify-between p-3 font-medium">
      <EditableText
        className="inline-block grow-0 [&>button]:p-0 [&>input]:m-0 [&>input]:w-auto [&>input]:px-3 [&>input]:py-1 [&>input]:text-lg [&>input]:font-bold [&>input:focus]:shadow-none"
        defaultText={name}
        onEdit={text => {
          updateBoardName.mutate({ id: board.id, name: text });
        }}
        editing={isEditingName}
        onEditingChange={setIsEditingName}
        editOnClick>
        <h2 className="hover:bg-button-hovered-background inline-block overflow-hidden rounded-xs px-3 py-1 text-lg font-bold text-white">
          {name}
        </h2>
      </EditableText>
      <StarToggleBoard boardId={board.id} />
    </div>
  );
}
