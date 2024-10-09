import Link from 'next/link';
import BoardsIcon from '../icons/boards';

export function MainSideNav() {
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
      <Link href="/workspaces">
        <div className="mt-4 bg-button-selected-background py-2">
          <span className="flex items-center gap-3 px-4">
            <BoardsIcon height="16px" /> Workspaces
          </span>
        </div>
      </Link>
    </nav>
  );
}
