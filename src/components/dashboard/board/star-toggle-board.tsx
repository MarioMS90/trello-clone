'use client';

import { TBoard } from '@/types/types';
import { updateEntityAction } from '@/lib/actions';
import { useEffect, useState } from 'react';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export default function StarToggleBoard({
  className = '',
  board,
}: {
  className?: string;
  board: TBoard;
}) {
  const [isStarred, setIsStarred] = useState(board.starred);

  useEffect(() => {
    setIsStarred(board.starred);
  }, [board.starred]);

  const handleStarToggle = async () => {
    const starred = !isStarred;

    try {
      updateEntityAction({
        tableName: 'board',
        entityData: { id: board.id, starred },
      });
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while updating the element');
      return;
    }

    setIsStarred(starred);
  };

  return (
    <button
      className={`center-y absolute right-3 ${className}`}
      type="button"
      onClick={handleStarToggle}
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
