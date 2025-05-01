'use client';

import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { memo } from 'react';
import { starredBoardKeys, useBoard, useStarredBoardId } from '@/lib/board/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TStarredBoard } from '@/types/db';
import invariant from 'tiny-invariant';
import { useCurrentUser } from '@/lib/user/queries';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export const StarToggleBoard = memo(function StarToggleBoard({
  className = '',
  boardId,
}: {
  className?: string;
  boardId: string;
}) {
  const queryClient = useQueryClient();
  const { data: board } = useBoard(boardId);
  const { data: starredBoardId } = useStarredBoardId(board.id);
  const { data: user } = useCurrentUser();
  const { queryKey } = starredBoardKeys.list(user.id);

  const addStarred = useMutation({
    mutationFn: async () => createStarredBoard(user.id, board.id),
    onSuccess: async ({ data }) => {
      invariant(data);

      return queryClient.setQueryData(queryKey, (old: TStarredBoard[]) => [...old, data]);
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const removeStarred = useMutation({
    mutationFn: async () => deleteStarredBoard(starredBoardId),
    onSuccess: async ({ data }) => {
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
        className={`center-y absolute right-3 cursor-pointer ${className}`}
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
