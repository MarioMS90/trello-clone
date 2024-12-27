'use client';

import { starToggleAction } from '@/lib/actions';
import { useEffect, useState } from 'react';
import StarIcon from '../icons/star';
import StarFillIcon from '../icons/star-fill';

export function StarToggle({
  className = '',
  boardId,
  starred,
  onStarToggle,
}: {
  className?: string;
  boardId: string;
  starred: boolean;
  onStarToggle?: (starred: boolean) => void;
}) {
  const [isStarred, setIsStarred] = useState(starred);

  useEffect(() => {
    setIsStarred(starred);
  }, [starred]);

  const handleStarToggle = async () => {
    setIsStarred(!isStarred);
    onStarToggle?.(!isStarred);
    await starToggleAction(boardId, !starred);
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
