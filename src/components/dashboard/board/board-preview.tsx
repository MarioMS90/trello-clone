import Link from 'next/link';
import { memo } from 'react';
import { TBoard } from '@/types/db';
import { StarToggleBoard } from './star-toggle-board';

export const BoardPreview = memo(function BoardPreview({ board }: { board: TBoard }) {
  return (
    <li
      className="relative h-20 w-44 rounded bg-white text-primary hover:bg-opacity-95"
      key={board.id}>
      <Link
        className="block h-full w-full pl-4 pt-2 text-sm font-bold"
        href={`/boards/${board.id}`}>
        {board.name}
      </Link>

      <StarToggleBoard className="bottom-3 top-[unset] transform-none" boardId={board.id} />
    </li>
  );
});
