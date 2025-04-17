'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { memo } from 'react';
import { useBoard, useStarredBoardId } from '@/lib/board/queries';
import { useRealTimeContext } from '@/providers/real-time-provider';
import { useMutation } from '@tanstack/react-query';
import { MutationType } from '@/types/db';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export const StarToggleBoard = memo(function StarToggleBoard({
  className = '',
  boardId,
}: {
  className?: string;
  boardId: string;
}) {
  const { awaitCacheSync } = useRealTimeContext();
  const { data: board } = useBoard(boardId);
  const { data: starredBoardId } = useStarredBoardId(board.id);

  const addStarred = useMutation({
    mutationFn: async () => createStarredBoard(board.id),
    onSuccess: async ({ data }) => {
      if (!data) {
        throw new Error('Invalid response data');
      }

      return awaitCacheSync({
        entityName: 'starred_boards',
        mutationType: MutationType.INSERT,
        match: data,
      });
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeStarred = useMutation({
    mutationFn: async () => deleteStarredBoard(starredBoardId),
    onSuccess: async ({ data }) => {
      if (!data) {
        throw new Error('Invalid response data');
      }

      return awaitCacheSync({
        entityName: 'starred_boards',
        mutationType: MutationType.DELETE,
        match: data,
      });
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const toggleStarredBoard = (create: boolean) => {
    if (addStarred.isPending || removeStarred.isPending) {
      return;
    }

    if (create) {
      addStarred.mutate();
      return;
    }

    removeStarred.mutate();
  };

  const isStarred = addStarred.isPending || (!removeStarred.isPending && Boolean(starredBoardId));

  return (
    <>
      <button
        className={`center-y absolute right-3 ${className}`}
        type="button"
        onClick={() => {
          toggleStarredBoard(!isStarred);
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
