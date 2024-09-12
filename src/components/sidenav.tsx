import ArrowDownIcon from './icons/arrow-down';
import BoardsIcon from './icons/boards';
import StarIcon from './icons/star';
import UserIcon from './icons/user';
import WorkspaceLogo from './ui/workspace-logo';

export default function SideNav() {
  return (
    <nav className="bg-sidenav-background w-[260px] border-r border-r-white border-opacity-30 text-white">
      <div className="border-b border-b-white border-opacity-20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WorkspaceLogo />
            <h2 className="pr-4 text-sm font-bold">Mario workspace</h2>
          </div>
          <div className="rotate-90 cursor-pointer rounded bg-white bg-opacity-10 p-1.5 hover:bg-opacity-20">
            <ArrowDownIcon height="15px" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <ul className="mt-2 text-sm [&>li]:flex [&>li]:items-center [&>li]:gap-3">
          <li>
            <BoardsIcon height="16px" /> Boards
          </li>
          <li>
            <UserIcon height="16px" /> Members
          </li>
        </ul>
        <h3>Your boards</h3>
        <ul>
          <li>
            Board 1 <StarIcon height="24px" />
          </li>
          <li>
            Board 2 <StarIcon height="24px" />
          </li>
        </ul>
      </div>
    </nav>
  );
}
