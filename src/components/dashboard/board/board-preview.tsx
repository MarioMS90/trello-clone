import Link from 'next/link';
import { memo } from 'react';
import { TBoard } from '@/types/db';
import { StarToggleBoard } from './star-toggle-board';

export const BoardPreview = memo(function BoardPreview({ board }: { board: TBoard }) {
  return (
    <li
      className="text-primary relative h-20 w-44 rounded-sm bg-white hover:bg-white/95"
      key={board.id}>
      <Link
        className="block h-full w-full pt-2 pl-4 text-sm font-bold"
        href={`/boards/${board.id}`}>
        {board.name}
      </Link>

      <StarToggleBoard className="top-[unset] bottom-3 transform-none" boardId={board.id} />
    </li>
  );
});
