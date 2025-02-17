'use client';

import { TBoard } from '@/types/types';
import { updateEntity } from '@/lib/actions';
import StarIcon from '../../icons/star';
import StarFillIcon from '../../icons/star-fill';

export default function StarToggleBoard({
  className = '',
  board,
}: {
  className?: string;
  board: TBoard;
}) {
  const handleStarToggle = async () => {
    const starred = !board.starred;

    try {
      updateEntity({
        tableName: 'board',
        entityData: { id: board.id, starred },
      });
    } catch (error) {
      // TODO: Show error with a toast
      alert('An error occurred while updating the element');
      return;
    }
    console.log('aa');
    // updateBoard({ ...board, starred });
  };

  return (
    <button
      className={`center-y absolute right-3 ${className}`}
      type="button"
      onClick={handleStarToggle}
      title={
        board.starred
          ? `Click to unstar ${board.name}. It will be removed from your starred list.`
          : `Click to star ${board.name}. It will be added to your starred list.`
      }>
      {board.starred ? (
        <StarFillIcon className="text-yellow-400 hover:scale-125" height={16} />
      ) : (
        <StarIcon className="hover:scale-125" height={16} />
      )}
    </button>
  );
}
