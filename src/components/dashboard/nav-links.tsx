'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Board, UserWorkspace } from '@/types/app-types';
import BoardsIcon from '../icons/boards';
import UserIcon from '../icons/user';
import StarIcon from '../icons/star';
import StarFillIcon from '../icons/star-fill';

export function WorkspaceLinks({ workspace }: { workspace: UserWorkspace }) {
  const pathname = usePathname();

  const links = [
    { name: 'Boards', href: `/workspaces/${workspace?.id}`, icon: BoardsIcon },
    { name: 'Members', href: `/workspaces/${workspace?.id}/members`, icon: UserIcon },
  ];

  return (
    <ul className="pt-4">
      {links.map(link => (
        <Link key={link.name} href={link.href}>
          <div
            className={clsx('py-2 hover:bg-button-hovered-background', {
              'bg-button-hovered-background': pathname === link.href,
            })}>
            <span className="flex items-center gap-3 px-4">
              <link.icon height="16px" />
              {link.name}
            </span>
          </div>
        </Link>
      ))}
    </ul>
  );
}

export function BoardsLinks({ boards }: { boards: Board[] }) {
  const { id: idParam } = useParams();

  return (
    <ul>
      {boards.map(({ id, name, marked }) => (
        <li key={id}>
          <Link href={`/boards/${id}`}>
            <div
              className={clsx('py-2 hover:bg-button-hovered-background', {
                'bg-button-hovered-background': idParam === id,
              })}>
              <span className="flex items-center justify-between gap-3 px-4">
                {name} {marked ? <StarFillIcon height="18px" /> : <StarIcon height="18px" />}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
