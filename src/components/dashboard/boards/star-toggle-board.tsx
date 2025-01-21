'use client';

import { useEffect, useState } from 'react';
import { TBoard } from '@/types/types';
import { updateEntityAction } from '@/lib/actions';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export default function StarToggleBoard({
  className = '',
  starred,
  board,
  onStarToggle,
}: {
  className?: string;
  starred: boolean;
  board?: TBoard;
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
        updateEntityAction({
          tableName: 'board',
          entityData: { id: board.id, starred: !isStarred },
          revalidate: true,
        });
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
