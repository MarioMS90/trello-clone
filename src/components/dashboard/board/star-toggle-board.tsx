'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import useWaitForChange from '@/hooks/useMutationResolver';
import { useBoard, useStarredBoard } from '@/lib/board/queries';
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
  const { data: starredBoard } = useStarredBoard(board.id);

  const waitForChange = useWaitForChange(starredBoard);
  const mutation = useMutation({
    mutationFn: async (isStarred: boolean) => {
      if (isStarred) {
        deleteStarredBoard(board.id);
      } else {
        createStarredBoard(board.id);
      }

      await waitForChange();
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const isStarred = mutation.isPending ? !mutation.variables : !!starredBoard;

  return (
    <>
      <button
        className={`center-y absolute right-3 ${className}`}
        type="button"
        onClick={() => {
          mutation.mutate(isStarred);
        }}
        title={
          isStarred
            ? `Click to unstar ${board.name}. It will be removed from your starred list.`
            : `Click to star ${board.name}. It will be added to your starred list.`
        }>
        {isStarred ? (
          <StarFillIcon className="text-yellow-400 hover:scale-125" height={16} />
        ) : (
          <StarIcon className="hover:scale-125" height={16} />
        )}
      </button>
    </>
  );
});
