'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { memo } from 'react';
import { useBoard, useStarredBoard } from '@/lib/board/queries';
import useOptimisticMutation from '@/hooks/useOptimisticMutation';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export const StarToggleBoard = memo(function StarToggleBoard({
  className = '',
  boardId,
}: {
  className?: string;
  boardId: string;
}) {
  const { data: board } = useBoard(boardId);
  const { data: isStarred } = useStarredBoard(board.id);

  const [{ mutate }, optimisticStarred] = useOptimisticMutation({
    state: isStarred,
    updater: (_, variables) => variables,
    options: {
      mutationFn: async (create: boolean) => {
        if (create) {
          await createStarredBoard(board.id);
        } else {
          await deleteStarredBoard(board.id);
        }
      },
      onError: () => {
        alert('An error occurred while updating the element');
      },
    },
  });

  return (
    <>
      <button
        className={`center-y absolute right-3 ${className}`}
        type="button"
        onClick={() => {
          mutate(!optimisticStarred);
        }}
        title={
          optimisticStarred
            ? `Click to unstar ${board.name}. It will be removed from your starred list.`
            : `Click to star ${board.name}. It will be added to your starred list.`
        }>
        {optimisticStarred ? (
          <StarFillIcon className="text-yellow-400 hover:scale-125" height={16} />
        ) : (
          <StarIcon className="hover:scale-125" height={16} />
        )}
      </button>
    </>
  );
});
