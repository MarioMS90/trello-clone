import Link from 'next/link';
import AppsIcon from '../icons/apps';
import ArrowDownIcon from '../icons/arrow-down';
import SearchIcon from '../icons/search';
import Avatar from '../ui/avatar';
import TrelloWhiteIcon from '../icons/trello-white';

export default function Header() {
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
      <nav
        className={`
          flex
          items-center
          text-sm 
          font-medium 
          [&>a:hover]:bg-button-hovered-background
          [&>a]:rounded 
          [&>a]:p-1.5 
          [&>div:hover]:bg-button-hovered-background 
          [&>div]:flex 
          [&>div]:cursor-pointer 
          [&>div]:items-center 
          [&>div]:gap-2
          [&>div]:rounded 
          [&>div]:px-3 
          [&>div]:py-1.5 
        `}>
        <Link href="#">
          <AppsIcon height="20px" />
        </Link>
        <Link href="/">
          <TrelloWhiteIcon height="25px" />
        </Link>
        <div>
          Workspaces
          <ArrowDownIcon height="16px" />
        </div>
        <div>
          Marked
          <ArrowDownIcon height="16px" />
        </div>
        <button
          className={`
              ml-3 
              rounded 
              bg-white 
              bg-opacity-20 
              px-3 
              py-1.5 
              text-white 
              hover:bg-opacity-30
            `}
          type="button">
          Create board
        </button>
      </nav>
      <div className="flex items-center gap-4">
        <div className="relative h-7 w-72">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 transform">
            <SearchIcon height="17px" />
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
        <Avatar />
      </div>
    </header>
  );
}
