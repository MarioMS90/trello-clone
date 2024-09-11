import Link from 'next/link';
import AppsIcon from './icons/apps';
import TrelloIcon from './icons/trello';
import ArrowDownIcon from './icons/arrow-down';

export default function Header() {
  return (
    <header className="text-grey flex items-center p-2">
      <nav
        className={`
          flex
          items-center
          text-sm 
          font-medium 
          [&>a:hover]:bg-gray-200 
          [&>a]:rounded 
          [&>a]:p-1.5 
          [&>div:hover]:bg-gray-200 
          [&>div]:flex 
          [&>div]:cursor-pointer 
          [&>div]:items-center 
          [&>div]:gap-2 
          [&>div]:rounded 
          [&>div]:px-4 
          [&>div]:py-1.5 
        `}>
        <Link href="#">
          <AppsIcon height="20px" />
        </Link>
        <Link href="/">
          <TrelloIcon height="26px" />
        </Link>
        <div>
          Workspaces
          <ArrowDownIcon height="16px" />
        </div>
        <div>
          Recent
          <ArrowDownIcon height="16px" />
        </div>
        <div>
          Marked
          <ArrowDownIcon height="16px" />
        </div>
        <div>
          Templates
          <ArrowDownIcon height="16px" />
        </div>
        <button className="bg-secondary text-white" type="button">
          Crear
        </button>
      </nav>
    </header>
  );
}
