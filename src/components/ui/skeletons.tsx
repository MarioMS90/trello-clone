import AppsIcon from '../icons/apps';
import TrelloWhiteIcon from '../icons/trello-white';
import Loading from './loading';

// Loading animation
const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-gray-200 before:to-transparent';

export function HeaderSkeleton() {
  return (
    <div className="bg-primary-background flex h-12 items-center justify-between border-b border-b-white/30 p-1.5 text-white">
      <div className="[&>div:hover]:bg-button-hovered-background flex items-center text-sm [&>div]:relative [&>div]:h-[32px] [&>div]:rounded-sm">
        <div className="w-[32px]">
          <div className="center-xy">
            <AppsIcon />
          </div>
        </div>
        <div className="w-[91px]">
          <div className="center-xy">
            <TrelloWhiteIcon />
          </div>
        </div>
      </div>
      <div
        className={`${shimmer} bg-primary flex size-6 cursor-pointer items-center justify-center rounded-full text-xs text-white`}></div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <nav className="bg-secondary-background w-[260px] border-r border-r-white/30 text-white">
      <div className="border-b border-b-white/20 p-4">
        <div className="flex items-center gap-2">
          <div className={`${shimmer} h-8 w-8 rounded-sm bg-white`} />
          <div className={`${shimmer} h-4 w-24 rounded-sm bg-white`} />
        </div>
      </div>
    </nav>
  );
}

function BoardSkeleton() {
  return (
    <div className={`${shimmer} h-20 w-44 rounded-sm bg-white pt-2 pl-4`}>
      <div className="h-4 w-32 rounded-md bg-white text-sm font-medium" />
      <div className="absolute right-3 bottom-3 z-10 size-4 rounded-md bg-white" />
    </div>
  );
}

export function BoardsSkeleton() {
  return (
    <div className="mt-4 mb-16 flex flex-wrap gap-4">
      <BoardSkeleton />
      <BoardSkeleton />
      <BoardSkeleton />
    </div>
  );
}

function ListSkeleton({ className }: { className: string }) {
  return (
    <div
      className={`${shimmer} text-primary w-[272px] rounded-xl bg-white p-2 text-sm ${className}`}></div>
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

export function MembersSkeleton() {
  return (
    <div className="mx-auto max-w-[1250px] px-26">
      <div className="mx-auto flex h-14 w-[850px] items-center justify-between">
        <div className={`${shimmer} mx-auto h-4 w-[150px] rounded-sm bg-white`}></div>
        <div className={`${shimmer} mx-auto h-8 w-[250px] rounded-sm bg-white`}></div>
      </div>
      <div className="mt-4 flex flex-1 items-center justify-center">
        <Loading />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="scrollbar-stable fixed top-0 left-0 z-50 h-dvh w-dvw bg-black/75">
      <div className="center-x fixed top-12 flex h-32 w-auto items-center justify-center rounded-xl bg-neutral-200 p-4 md:w-[768px]">
        <Loading width="32px" height="32px" />
      </div>
    </div>
  );
}
