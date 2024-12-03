import Link from 'next/link';
import AppsIcon from '../icons/apps';
import TrelloWhiteIcon from '../icons/trello-white';

// Loading animation
const shimmer = `
    relative
    overflow-hidden
    before:absolute 
    before:inset-0 
    before:-translate-x-full 
    before:animate-[shimmer_2s_infinite] 
    before:bg-gradient-to-r 
    before:from-transparent 
    before:via-white/60 
    before:to-transparent
  `;

export function HeaderSkeleton() {
  return (
    <header
      className={`
      flex h-12 
      items-center 
      justify-between 
      border-b 
      border-b-white 
      border-opacity-30 
      bg-header-background 
      p-1.5 
      text-white
    `}>
      <nav className="flex items-center text-sm [&>a:hover]:bg-button-hovered-background [&>a]:relative [&>a]:h-[32px] [&>a]:rounded">
        <Link className="w-[32px]" href="/workspaces">
          <span className="center-xy">
            <AppsIcon />
          </span>
        </Link>
        <Link className="w-[91px]" href="/workspaces">
          <span className="center-xy">
            <TrelloWhiteIcon />
          </span>
        </Link>
      </nav>

      <div
        className={`${shimmer} flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-xs text-white`}></div>
    </header>
  );
}

export function SidebarSkeleton() {
  return (
    <nav
      className={`
      w-[260px] 
      border-r 
      border-r-white 
      border-opacity-30 
      bg-sidenav-background 
      text-white
    `}>
      <div className="border-b border-b-white border-opacity-20 p-4">
        <div className="flex items-center gap-2">
          <div className={`${shimmer} h-8 w-8 rounded bg-gray-200`} />
          <div className={`${shimmer} h-4 w-24 rounded bg-gray-200`} />
        </div>
      </div>
    </nav>
  );
}

export function BoardSkeleton() {
  return (
    <div className={`${shimmer} h-20 w-44 rounded bg-white pl-4 pt-2`}>
      <div className="h-4 w-32 rounded-md bg-gray-200 text-sm font-medium" />
      <div className="absolute bottom-3 right-3 z-10 size-4 rounded-md bg-gray-200" />
    </div>
  );
}

export function BoardsSkeleton() {
  return (
    <div className="mt-4 flex flex-wrap gap-4">
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
    </div>
  );
}
