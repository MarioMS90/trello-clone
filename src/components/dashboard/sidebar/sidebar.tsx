import Link from 'next/link';
import BoardsIcon from '@/components/icons/boards';

export function Sidebar() {
  return (
    <nav className="bg-secondary-background z-10 min-w-[260px] border-r border-r-white/30 text-white">
      <Link href="/workspaces">
        <div className="bg-button-selected-background mt-4 py-2">
          <span className="flex items-center gap-3 px-4">
            <BoardsIcon height={16} /> Workspaces
          </span>
        </div>
      </Link>
    </nav>
  );
}
