'use client';

import { starToggleAction } from '@/lib/actions';
import { useState } from 'react';
import StarIcon from '../icons/star';
import StarFillIcon from '../icons/star-fill';

export function StarToggle({
  className = '',
  boardId,
  starred,
}: {
  className?: string;
  boardId: string;
  starred: boolean;
}) {
  const [isStarred, setIsStarred] = useState(starred);

  const handleStarToggle = async () => {
    setIsStarred(prev => !prev);
    await starToggleAction(boardId, !starred);
  };

  return (
    <button
      className={`center-y absolute right-3 ${className}`}
      type="button"
      onClick={handleStarToggle}>
      {isStarred ? (
        <StarFillIcon className="text-yellow-400 hover:scale-125" height="16px" />
      ) : (
        <StarIcon className="hover:scale-125" height="16px" />
      )}
    </button>
  );
}
