import Link from 'next/link';
import { signOutAction } from '@/lib/auth-actions';
import AppsIcon from '@/components/icons/apps';
import Avatar from '@/components/ui/avatar';
import TrelloWhiteIcon from '@/components/icons/trello-white';
import HeaderMenu from '@/components/dashboard/header/header-menu';
import HeaderSearch from '@/components/dashboard/header/header-search';
import Popover from '../../ui/popover';

export default async function Header() {
  const starredBoards = await fetchBoards({ eq: { column: 'starred', value: true } });

  return (
    <header
      className="
        z-10 
        flex 
        h-12
        items-center 
        justify-between 
        border-b 
        border-b-white 
        border-opacity-30 
        bg-primary-background
        p-2 
        text-white
      ">
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
        <HeaderMenu />
      </nav>
      <div className="flex flex-1 items-center justify-end gap-4">
        <HeaderSearch placeholder="Search Trello" />
        <Popover
          triggerContent={<Avatar />}
          triggerClassName="rounded-full [&]:p-1"
          popoverClassName="right-0 left-auto px-0 [&]:w-40">
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
