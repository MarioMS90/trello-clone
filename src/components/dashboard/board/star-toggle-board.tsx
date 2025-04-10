'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { useMutation } from '@tanstack/react-query';
import { memo } from 'react';
import useAwaitChange from '@/hooks/useAwaitChange';
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
  const starred = !!starredBoard;

  const waitForChange = useAwaitChange(starredBoard);
  const { mutate, isPending, variables } = useMutation({
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

  const optimisticStarred = isPending ? !variables : starred;

  return (
    <>
      <button
        className={`center-y absolute right-3 ${className}`}
        type="button"
        onClick={() => {
          mutate(optimisticStarred);
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
