'use client';

import { TBoard } from '@/types/db';
import { toggleStarredBoard } from '@/lib/board/actions';
import { useMutation } from '@tanstack/react-query';
import { memo, useEffect, useRef } from 'react';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export const StarToggleBoard = memo(function StarToggleBoard({
  className = '',
  board,
  starred,
}: {
  className?: string;
  board: TBoard;
  starred: boolean;
}) {
  const resolveRef = useRef<((value: null) => void) | null>(null);
  const waitForCacheMutation = new Promise(res => {
    resolveRef.current = res;
  });

  useEffect(() => {
    if (!resolveRef.current) {
      return;
    }

    resolveRef.current(null);
  }, [starred]);

  const mutation = useMutation({
    mutationFn: async (isStarred: boolean) => {
      await toggleStarredBoard(board.id, isStarred);
    },
    onSuccess: async _ => {
      await waitForCacheMutation;
    },
    onError: () => {
      alert('An error occurred while updating the element');
    },
  });

  const isStarred = mutation.isPending ? !mutation.variables : starred;

  return (
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
  );
});
