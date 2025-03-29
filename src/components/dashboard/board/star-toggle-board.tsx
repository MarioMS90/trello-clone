'use client';

import { TBoard, TStarredBoard } from '@/types/db';
import { createStarredBoard, deleteStarredBoard } from '@/lib/board/actions';
import { QueryObserver, useMutation, useQueryClient } from '@tanstack/react-query';
import { starredBoardKeys, useStarredBoard, useStarredBoards } from '@/lib/board/queries';
import { useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database-types';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export default function StarToggleBoard({
  className = '',
  board,
}: {
  className?: string;
  board: TBoard;
}) {
  const { data: starredBoardIds } = useStarredBoards();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (create: boolean) => {
      if (create) {
        await createStarredBoard(board.id);
        return;
      }

      await deleteStarredBoard(board.id);
    },
    onSuccess: async (_, create) => {
      const { promise: waitForCache, resolve, reject } = Promise.withResolvers();
      const checkState = (currentState: string[]) => {
        const starred = currentState.some(id => id === board.id);
        if (create === starred) {
          resolve(null);
        }
      };
      ref.current = [...ref.current, checkState];
      // wait for the cache to update
      await waitForCache();
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const isStarred = mutation.isPending
    ? mutation.variables
    : starredBoardIds.some(id => id === board.id);

  return (
    <button
      className={`center-y absolute right-3 ${className}`}
      type="button"
      onClick={() => {
        mutation.mutate(!isStarred);
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
  );
}
