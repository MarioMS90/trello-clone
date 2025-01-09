'use client';

import { useEffect, useState } from 'react';
import { Board } from '@/types/app-types';
import { updateBoardAction } from '@/lib/actions';
import StarIcon from '../icons/star';
import StarFillIcon from '../icons/star-fill';

export function StarToggleBoard({
  className = '',
  starred,
  board,
  onStarToggle,
}: {
  className?: string;
  starred: boolean;
  board?: Board;
  onStarToggle?: () => void;
}) {
  const [isStarred, setIsStarred] = useState(starred);

  useEffect(() => {
    setIsStarred(starred);
  }, [starred]);

  const handleStarToggle = async () => {
    setIsStarred(!isStarred);

    if (board) {
      try {
        await updateBoardAction({ id: board.id, starred: !isStarred });
      } catch (error) {
        // TODO: Show error with a toast
        alert('An error occurred while updating the element');
      }
    }

    if (onStarToggle) {
      onStarToggle();
    }
  };

  return (
    <button
      className={`center-y absolute right-3 ${className}`}
      type="button"
      onClick={handleStarToggle}>
      {isStarred ? (
        <StarFillIcon className="text-yellow-400 hover:scale-125" height={16} />
      ) : (
        <StarIcon className="hover:scale-125" height={16} />
      )}
    </button>
  );
}
