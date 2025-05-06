'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { memo } from 'react';
import { starredBoardKeys, useStarredBoardId } from '@/lib/board/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TBoard, TStarredBoard } from '@/types/db';
import invariant from 'tiny-invariant';
import { cn } from '@/lib/utils/utils';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

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

      return queryClient.setQueryData(queryKey, (old: TStarredBoard[]) => [...old, data]);
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeStarred = useMutation({
    mutationFn: () => deleteStarredBoard(starredBoardId),
    onSuccess: ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(queryKey, (old: TStarredBoard[]) =>
        old.filter(_starred => _starred.id !== data.id),
      );
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
