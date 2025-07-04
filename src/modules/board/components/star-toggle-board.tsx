'use client';

import { createStarredBoard, deleteStarredBoard } from '@/modules/board/lib/actions';
import { memo } from 'react';
import { starredBoardKeys, useStarredBoardId } from '@/modules/board/lib/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TBoard } from '@/modules/common/types/db';
import invariant from 'tiny-invariant';
import { cn } from '@/modules/common/utils/utils';
import StarIcon from '@/modules/common/components/icons/star';
import StarFillIcon from '@/modules/common/components/icons/star-fill';
import { insertQueryData, deleteQueryData } from '@/modules/common/lib/react-query/utils';

export const StarToggleBoard = memo(function StarToggleBoard({
  className = '',
  board,
}: {
  className?: string;
  board: TBoard;
}) {
  const queryClient = useQueryClient();
  const { data: starredBoardId } = useStarredBoardId(board.id);
  const { queryKey } = starredBoardKeys.list;

  const addStarred = useMutation({
    mutationFn: () => createStarredBoard(board.id),
    onSuccess: ({ data }) => {
      invariant(data);
      insertQueryData({
        queryClient,
        queryKey,
        entity: data,
      });
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeStarred = useMutation({
    mutationFn: () => deleteStarredBoard(starredBoardId),
    onSuccess: ({ data }) => {
      invariant(data);
      deleteQueryData({
        queryClient,
        queryKey,
        entityId: data.id,
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
        className={cn('cursor-pointer hover:scale-125', className)}
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
          <StarFillIcon className="text-yellow-400" height={16} />
        ) : (
          <StarIcon height={16} />
        )}
      </button>
    </>
  );
});
