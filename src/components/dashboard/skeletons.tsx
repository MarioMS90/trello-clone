// Loading animation
const shimmer = `
    before:absolute 
    before:inset-0 
    before:-translate-x-full 
    before:animate-[shimmer_2s_infinite] 
    before:bg-gradient-to-r 
    before:from-transparent 
    before:via-white/60 
    before:to-transparent
  `;

export function BoardSkeleton() {
  return (
    <div className={`${shimmer} relative h-20 w-44 overflow-hidden rounded bg-white pl-4 pt-2`}>
      <div className="h-4 w-32 rounded-md bg-gray-200 text-sm font-medium" />
      <div className="absolute bottom-2 right-3 z-10 size-4 rounded-md bg-gray-200" />
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

export function SideNavSkeleton() {
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
          <div className={`${shimmer} relative h-8 w-8 overflow-hidden rounded bg-gray-200`} />
          <div className={`${shimmer} relative h-4 w-24 overflow-hidden rounded bg-gray-200`} />
        </div>
      </div>
    </nav>
  );
}
