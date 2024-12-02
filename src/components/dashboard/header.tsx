import Link from 'next/link';
import { fetchUser, fetchWorkspaces } from '@/lib/data';
import { getStarredBoards } from '@/lib/utils';
import { signOutAction } from '@/lib/auth-actions';
import AppsIcon from '../icons/apps';
import SearchIcon from '../icons/search';
import Avatar from '../ui/avatar';
import TrelloWhiteIcon from '../icons/trello-white';
import { HeaderButtons } from './header-buttons';
import Popover from '../ui/popover';

export default async function Header() {
  const workspaces = await fetchWorkspaces();
  const starredBoards = await getStarredBoards();
  const user = await fetchUser();

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
      <nav className="flex items-center text-sm [&>a:hover]:bg-button-hovered-background [&>a]:rounded [&>a]:p-1.5">
        <Link href="/workspaces">
          <AppsIcon height={20} />
        </Link>
        <Link href="/workspaces">
          <TrelloWhiteIcon height={25} />
        </Link>
        <HeaderButtons workspaces={workspaces} starredBoards={starredBoards} />
      </nav>
      <div className="flex items-center gap-4">
        <div className="relative h-7 w-72">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
            <SearchIcon height={17} />
          </span>
          <input
            className={`
                h-full 
                w-full 
                rounded 
                border 
                border-gray-400 
                bg-white 
                bg-opacity-20 
                pl-8 
                text-sm 
                text-white 
                placeholder-white 
                outline-none 
                hover:bg-opacity-30 
                focus-visible:border-secondary
              `}
            type="text"
            placeholder="Search"></input>
        </div>
        <Popover
          triggerContent={<Avatar userName={user.name} />}
          triggerClassName="rounded-full [&]:p-1"
          popoverClassName="right-0 left-auto px-0">
          <button
            className="px-3 py-2 text-left text-sm hover:bg-gray-200"
            type="button"
            onClick={async () => {
              'use server';

              await signOutAction();
            }}>
            Log out
          </button>
        </Popover>
      </div>
    </header>
  );
}
