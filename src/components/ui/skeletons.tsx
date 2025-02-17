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
    before:via-gray-100
    before:to-transparent
  `;

export function HeaderSkeleton() {
  return (
    <header
      className={`
      flex 
      h-12 
      items-center 
      justify-between 
      border-b 
      border-b-white 
      border-opacity-30 
      bg-primary-background 
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
      bg-secondary-background 
      text-white
    `}>
      <div className="border-b border-b-white border-opacity-20 p-4">
        <div className="flex items-center gap-2">
          <div className={`${shimmer} h-8 w-8 rounded bg-white`} />
          <div className={`${shimmer} h-4 w-24 rounded bg-white`} />
        </div>
      </div>
    </nav>
  );
}

function BoardSkeleton() {
  return (
    <div className={`${shimmer} h-20 w-44 rounded bg-white pl-4 pt-2`}>
      <div className="h-4 w-32 rounded-md bg-white text-sm font-medium" />
      <div className="absolute bottom-3 right-3 z-10 size-4 rounded-md bg-white" />
    </div>
  );
}

export function BoardsSkeleton() {
  return (
    <div className="mb-16 mt-4 flex flex-wrap gap-4">
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
    </div>
  );
}

function ListSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`${shimmer} w-[272px] rounded-xl bg-white p-2 text-sm text-primary ${className}`}></div>
  );
}

export function ListsSkeleton() {
  return (
    <div className="h-[calc(100% - 8px)] flex gap-4 p-4">
      <ListSkeleton className="h-[350px]" />
      <ListSkeleton className="h-[200px]" />
      <ListSkeleton className="h-[150px]" />
    </div>
  );
}
