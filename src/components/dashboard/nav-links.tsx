import Link from 'next/link';
import clsx from 'clsx';
import { Board, UserWorkspace } from '@/types/app-types';
import { WorkspacePageNames } from '@/constants/constants';
import BoardsIcon from '../icons/boards';
import UserIcon from '../icons/user';
import { StarToggle } from './star-toggle';

export function WorkspaceLinks({
  workspace,
  actualPageName,
}: {
  workspace: UserWorkspace;
  actualPageName?: string;
}) {
  const links = [
    {
      name: WorkspacePageNames.BOARDS,
      href: `/workspaces/${workspace?.id}`,
      icon: BoardsIcon,
    },
    {
      name: WorkspacePageNames.MEMBERS,
      href: `/workspaces/${workspace?.id}/members`,
      icon: UserIcon,
    },
  ];

  return (
    <ul className="pt-4">
      {links.map(link => (
        <li key={link.name}>
          <Link key={link.name} href={link.href}>
            <div
              className={clsx('py-2 hover:bg-button-hovered-background', {
                'bg-button-selected-background': actualPageName === link.name,
              })}>
              <span className="flex items-center gap-3 px-4">
                <link.icon height="16px" />
                {link.name}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function BoardsLinks({
  boards,
  selectedBoardId,
}: {
  boards: Board[];
  selectedBoardId?: string;
}) {
  return (
    <ul>
      {boards.map(({ id, name, starred }) => (
        <li
          className={clsx('relative px-4 py-2 hover:bg-button-hovered-background', {
            'bg-button-hovered-background': selectedBoardId === id,
          })}
          key={id}>
          <Link href={`/boards/${id}`}>{name}</Link>
          <StarToggle boardId={id} starred={starred} />
        </li>
      ))}
    </ul>
  );
}
